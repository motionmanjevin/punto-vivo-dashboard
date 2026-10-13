import { Award, RefreshCw, Clock, CheckCircle, Check, X } from 'lucide-react';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';

interface Props {
  state: AppState;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function Rewards({ state, onApprove, onReject }: Props) {
  const t = useT(state.lang);
  const rw = state.rewards;

  return (
    <div className="rise">
      <div className="grid g4" style={{ marginBottom: 20 }}>
        <div className="stat rise"><div className="lb"><span className="ic" style={{ background: '#22c55e22', color: '#22c55e' }}><Award size={15} /></span>{t('rewards.earned')}</div><div className="vl big t-green">{rw.reduce((a, r) => a + r.pointsEarned, 0).toLocaleString()}</div></div>
        <div className="stat rise"><div className="lb"><span className="ic" style={{ background: '#38bdf822', color: '#38bdf8' }}><RefreshCw size={15} /></span>{t('rewards.redeemed')}</div><div className="vl big t-sky">{rw.reduce((a, r) => a + r.pointsRedeemed, 0).toLocaleString()}</div></div>
        <div className="stat rise"><div className="lb"><span className="ic" style={{ background: '#f59e0b22', color: '#f59e0b' }}><Clock size={15} /></span>{t('rewards.outstanding')}</div><div className="vl big t-amber">{rw.reduce((a, r) => a + r.balance, 0).toLocaleString()}</div></div>
        <div className="stat rise"><div className="lb"><span className="ic" style={{ background: '#a78bfa22', color: '#a78bfa' }}><CheckCircle size={15} /></span>{t('rewards.approved_red')}</div><div className="vl big t-violet">{rw.reduce((a, r) => a + r.approvedRedemptions, 0)}</div></div>
      </div>
      <div className="card">
        <div className="card-h"><h3>{t('rewards.title')}</h3></div>
        <div className="card-b" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>
                <th>{t('citizens.name')}</th><th>{t('rewards.earned')}</th><th>{t('rewards.redeemed')}</th>
                <th>{t('rewards.outstanding')}</th><th>{t('rewards.pending_red')}</th><th>{t('rewards.approved_red')}</th>
                <th>{t('rewards.rejected_red')}</th><th>{t('rewards.last')}</th><th>{t('reports.actions')}</th>
              </tr></thead>
              <tbody>
                {rw.map(r => (
                  <tr key={r.id}>
                    <td><b>{r.citizen}</b></td>
                    <td className="mono t-green">{r.pointsEarned.toLocaleString()}</td>
                    <td className="mono t-sky">{r.pointsRedeemed.toLocaleString()}</td>
                    <td className="mono t-amber" style={{ fontWeight: 700 }}>{r.balance.toLocaleString()}</td>
                    <td className="mono">{r.pendingRedemptions}</td>
                    <td className="mono t-green">{r.approvedRedemptions}</td>
                    <td className="mono t-red">{r.rejectedRedemptions}</td>
                    <td style={{ fontSize: 11 }}>{r.lastRedemption}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm primary" onClick={() => onApprove(r.id)}><Check size={11} /></button>
                        <button className="btn sm danger" onClick={() => onReject(r.id)}><X size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
