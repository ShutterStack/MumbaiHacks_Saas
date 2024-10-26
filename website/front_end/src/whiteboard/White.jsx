import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

export default function App() {
  return (
    <div style={{ position: 'fixed', bottom: '40px', right: '20px', width: '2100px', height: '750px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', overflow: 'hidden' }}>
      <div style={{ padding: '10px', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <h4 style={{ margin: 0 }}>Drawing Board</h4>
      </div>
      <Tldraw />
    </div>
  );
}
