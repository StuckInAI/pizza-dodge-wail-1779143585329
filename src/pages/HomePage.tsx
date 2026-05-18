import { useNavigate } from 'react-router-dom';
import Terminal from '@/components/Terminal';
import Button from '@/components/Button';
import { Play, Users } from 'lucide-react';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <div className={styles.brand}>
          <div className={styles.pizza}>🍕</div>
          <h1 className={styles.title}>Prompt <span>the</span> Pizza</h1>
          <p className={styles.tag}>a multiplayer prompt-engineering party game</p>
        </div>

        <Terminal title="~/prompt-the-pizza — README">
          <p className={styles.prompt}>cat mission.txt</p>
          <div className={styles.body}>
            <p>
              Get an AI image generator to draw a <strong>🍕 pizza</strong> — without saying the word, or any of its delicious accomplices.
            </p>
            <p style={{ marginTop: 12 }}>Banned words include:</p>
            <ul>
              <li>pizza, cheese, crust, sauce, dough, slice, pepperoni…</li>
              <li>(and we catch leetspeak, typos, &amp; punctuation tricks 👀)</li>
            </ul>
            <p style={{ marginTop: 12 }}>Each player gets <strong>3 attempts</strong>. Score using the <strong>PIZZA framework</strong> (Persona, Intent, Zones, Zen, Actions). Round lasts <strong>5 minutes</strong>.</p>
            <p style={{ marginTop: 12 }}>Be vivid. Be sneaky. Be a poet of the savory disc.</p>
          </div>
          <div className={styles.actions}>
            <Button variant="primary" onClick={() => navigate('/host')}>
              <Play size={14} /> Host a game
            </Button>
            <Button onClick={() => navigate('/join')}>
              <Users size={14} /> Join a game
            </Button>
          </div>
        </Terminal>
      </div>
    </div>
  );
}
