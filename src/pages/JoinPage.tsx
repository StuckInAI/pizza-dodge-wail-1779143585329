import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Terminal from '@/components/Terminal';
import Button from '@/components/Button';
import { useGame } from '@/hooks/GameContext';
import { ArrowLeft, LogIn } from 'lucide-react';
import styles from './HostPage.module.css';

export default function JoinPage() {
  const navigate = useNavigate();
  const { joinSession } = useGame();
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleJoin = () => {
    setError('');
    const trimmed = name.trim();
    const codeUp = code.trim().toUpperCase();
    if (!trimmed) { setError('Please enter your name.'); return; }
    if (codeUp.length < 4) { setError('Please enter a session code.'); return; }
    const session = joinSession(codeUp, trimmed);
    if (!session) {
      setError(`No active session found for code "${codeUp}". Ask the host to share it again.`);
      return;
    }
    navigate(`/game/${session.code}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <Terminal title="~/prompt-the-pizza/join">
          <p className={styles.prompt}>./join --code &lt;code&gt;</p>
          <label className={styles.label}>your name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="e.g. SneakyBaker"
            maxLength={24}
            autoFocus
          />
          <label className={styles.label}>session code</label>
          <input
            className={styles.input}
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC12"
            maxLength={6}
            style={{ letterSpacing: '0.3em', textTransform: 'uppercase' }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') handleJoin();
            }}
          />
          {error ? <div className={styles.error}>! {error}</div> : null}
          <div className={styles.actions}>
            <Link to="/"><Button variant="ghost"><ArrowLeft size={14} /> Back</Button></Link>
            <Button variant="primary" onClick={handleJoin}>
              <LogIn size={14} /> Join session
            </Button>
          </div>
        </Terminal>
      </div>
    </div>
  );
}
