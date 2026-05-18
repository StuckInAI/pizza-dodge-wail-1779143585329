import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Terminal from '@/components/Terminal';
import Button from '@/components/Button';
import { useGame } from '@/hooks/GameContext';
import { ArrowLeft, Rocket } from 'lucide-react';
import styles from './HostPage.module.css';

export default function HostPage() {
  const navigate = useNavigate();
  const { createSession } = useGame();
  const [name, setName] = useState<string>('');

  const handleStart = () => {
    const trimmed = name.trim() || 'Host';
    const session = createSession(trimmed);
    navigate(`/game/${session.code}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <Terminal title="~/prompt-the-pizza/host">
          <p className={styles.prompt}>./host --new-session</p>
          <label className={styles.label}>your name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="e.g. PromptChef99"
            maxLength={24}
            autoFocus
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') handleStart();
            }}
          />
          <div className={styles.actions}>
            <Link to="/"><Button variant="ghost"><ArrowLeft size={14} /> Back</Button></Link>
            <Button variant="primary" onClick={handleStart}>
              <Rocket size={14} /> Start session
            </Button>
          </div>
        </Terminal>
      </div>
    </div>
  );
}
