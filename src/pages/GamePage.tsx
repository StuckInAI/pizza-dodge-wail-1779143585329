import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Terminal from '@/components/Terminal';
import Button from '@/components/Button';
import Timer from '@/components/Timer';
import AIImageDisplay from '@/components/AIImageDisplay';
import AISetupGuide from '@/components/AISetupGuide';
import ScoreCard from '@/components/ScoreCard';
import WallOfShame from '@/components/WallOfShame';
import PromptEditor from '@/components/PromptEditor';
import CoachingPanel from '@/components/CoachingPanel';
import { useGame } from '@/hooks/GameContext';
import { checkBanned } from '@/lib/banned';
import { scorePrompt, judgeDish } from '@/lib/scoring';
import { getCoachingTips } from '@/lib/coaching';
import { generateDishName } from '@/lib/dishNames';
import { generateAIImage } from '@/lib/aiGenerate';
import { isAIConnected } from '@/lib/aiConfig';
import { MODEL_ANSWER } from '@/lib/modelAnswer';
import type { Attempt, DishKey } from '@/types';
import styles from './GamePage.module.css';

export default function GamePage() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const { getSession, submitAttempt, endSession, ensurePlayerId, refreshTick } = useGame();
  const myId = ensurePlayerId();

  const session = useMemo(() => getSession(code), [code, getSession, refreshTick]);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  // AI image generation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      const t = setTimeout(() => navigate('/'), 1500);
      return () => clearTimeout(t);
    }
  }, [session, navigate]);

  if (!session) {
    return (
      <div className={styles.page}>
        <Terminal title="~/error">
          <p>Session not found. Redirecting home...</p>
        </Terminal>
      </div>
    );
  }

  const me = session.players[myId];
  const endTime = session.startedAt + session.durationMs;
  const attemptsLeft = me ? Math.max(0, 3 - me.attempts.length) : 3;
  const lastAttempt: Attempt | undefined = me?.attempts[me.attempts.length - 1];

  const lastDish: DishKey = lastAttempt?.blocked
    ? 'circle-of-shame'
    : (lastAttempt?.dish ?? 'circle-of-shame');

  const lastDishName = lastAttempt && !lastAttempt.blocked && lastAttempt.dish
    ? generateDishName(lastAttempt.dish, lastAttempt.createdAt)
    : undefined;

  const lastCaption = lastAttempt?.blocked
    ? `BLOCKED: contained "${lastAttempt.blockedWord}"`
    : lastAttempt
    ? lastAttempt.passed
      ? '✓ PASSED — looks like the target!'
      : lastDishName ?? 'Not quite there yet...'
    : 'No attempts yet — describe the target dish';

  const coachingTips = lastAttempt && !lastAttempt.blocked && lastAttempt.score
    ? getCoachingTips(lastAttempt.score)
    : [];

  const canSubmit =
    !!me &&
    !me.finished &&
    session.status === 'running' &&
    prompt.trim().length > 0 &&
    attemptsLeft > 0 &&
    !aiLoading;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmit = useCallback(async () => {
    setError(null);
    if (!me) return;
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const ban = checkBanned(trimmed);
    const version = me.attempts.length + 1;
    const attemptId = `${myId}-${version}-${Date.now()}`;

    if (ban.blocked) {
      const attempt: Attempt = {
        id: attemptId,
        version,
        prompt: trimmed,
        blocked: true,
        blockedWord: ban.word,
        passed: false,
        dish: 'circle-of-shame',
        createdAt: Date.now(),
      };
      submitAttempt(code, myId, attempt);
      setPrompt('');
      setAiImageUrl(null);
      setAiError(null);
      return;
    }

    const score = scorePrompt(trimmed);
    const dish = judgeDish(trimmed, score);
    const passed = dish === 'pizza' && score.total >= 14;

    const attempt: Attempt = {
      id: attemptId,
      version,
      prompt: trimmed,
      blocked: false,
      passed,
      score,
      dish,
      createdAt: Date.now(),
    };
    submitAttempt(code, myId, attempt);
    setPrompt('');

    // Fire AI image generation if a provider is connected
    if (isAIConnected()) {
      setAiLoading(true);
      setAiImageUrl(null);
      setAiError(null);
      const result = await generateAIImage(trimmed);
      setAiLoading(false);
      if (result.type === 'url') {
        setAiImageUrl(result.url);
      } else if (result.type === 'error') {
        setAiError(result.message);
      }
      // type === 'mock' → leave null, DishSVG fallback renders
    } else {
      setAiImageUrl(null);
      setAiError(null);
    }
  }, [me, prompt, myId, code, submitAttempt]);

  const handleExpire = () => {
    if (session.status === 'running') endSession(code);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <Home size={14} /> prompt-the-pizza
        </Link>
        <div className={styles.headerRight}>
          <span className={styles.codeChip}>ROOM: {session.code}</span>
          <Timer endTime={endTime} onExpire={handleExpire} />
        </div>
      </header>

      <div className={styles.grid}>
        {/* LEFT: target + last result */}
        <div className={styles.left}>
          <Terminal title="~/target">
            <h3 className={styles.sectionTitle}>// Target Dish</h3>
            <AIImageDisplay
              dishKey="pizza"
              caption="Describe THIS — without forbidden words"
            />
            <p className={styles.hint}>
              You have <strong>{attemptsLeft}</strong> attempt(s) left. Banned words include
              everything obvious: pizza, cheese, sauce, dough, slice, pepperoni, margherita,
              etc. Use the PIZZA framework: <strong>P</strong>ersona, <strong>I</strong>ntent,{' '}
              <strong>Z</strong>ones (context), <strong>Z</strong>en (constraints),{' '}
              <strong>A</strong>ctions (format).
            </p>
          </Terminal>

          <Terminal title="~/your-creation">
            <h3 className={styles.sectionTitle}>// Your Last Creation</h3>
            <AIImageDisplay
              imageUrl={aiImageUrl}
              dishKey={lastDish}
              caption={lastCaption}
              loading={aiLoading}
              error={aiError}
            />
            {lastAttempt && !lastAttempt.blocked && lastAttempt.score ? (
              <div style={{ marginTop: 12 }}>
                <ScoreCard score={lastAttempt.score} />
              </div>
            ) : null}
          </Terminal>
        </div>

        {/* CENTER: prompt editor + coaching */}
        <div className={styles.center}>
          <Terminal title="~/prompt">
            <h3 className={styles.sectionTitle}>// Compose your prompt</h3>
            <AISetupGuide />
            <PromptEditor
              value={prompt}
              onChange={setPrompt}
              placeholder="You are a culinary illustrator. Render a round, oven-baked Italian flatbread topped with..."
              rows={8}
              disabled={!canSubmit && attemptsLeft === 0}
            />
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.actions}>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {aiLoading ? 'Generating…' : `Submit Attempt (${attemptsLeft} left)`}
              </Button>
              {me?.finished ? (
                <span className={styles.statusDone}>
                  {me.passed ? '✓ You passed!' : '✗ Out of attempts'}
                </span>
              ) : null}
            </div>
          </Terminal>

          {/* Coaching — show after any non-blocked attempt */}
          {lastAttempt && !lastAttempt.blocked && (
            <CoachingPanel
              tips={coachingTips}
              dishName={lastDishName}
              attemptVersion={lastAttempt.version}
            />
          )}

          {session.status === 'ended' || me?.finished ? (
            <Terminal title="~/model-answer">
              <h3 className={styles.sectionTitle}>// Reference Prompt</h3>
              <pre className={styles.modelAnswer}>{MODEL_ANSWER}</pre>
            </Terminal>
          ) : null}
        </div>

        {/* RIGHT: wall of shame */}
        <div className={styles.right}>
          <WallOfShame session={session} highlightPlayerId={myId} />
        </div>
      </div>
    </div>
  );
}
