import { Plus, Pencil, Image } from 'lucide-react';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';
import { fmtDate } from '@/lib/data';

interface Props {
  state: AppState;
  onToggleNews: (id: number) => void;
  onCreateNews: () => void;
}

export default function News({ state, onToggleNews, onCreateNews }: Props) {
  const t = useT(state.lang);
  const lang = state.lang;

  return (
    <div className="rise">
      <div className="card">
        <div className="card-h">
          <h3>{t('news.title')}</h3>
          <button className="btn primary" style={{ marginLeft: 'auto' }} onClick={onCreateNews}>
            <Plus size={14} /> {t('news.create')}
          </button>
        </div>
        <div className="card-b">
          <div className="grid g3">
            {state.news.map(n => (
              <div className="news-card" key={n.id}>
                {n.image
                  ? <img className="nc-thumb" src={n.image} alt="" />
                  : <div className="nc-placeholder"><Image size={32} color="var(--dim)" /></div>
                }
                <div className="nc-body">
                  <div className="nc-title">{lang === 'es' ? n.title : n.titleEn}</div>
                  <div className="nc-excerpt">{lang === 'es' ? n.excerpt : n.excerptEn}</div>
                  <div className="nc-meta">
                    <span>{fmtDate(n.date, lang)}</span>
                    <span className={`pill ${n.published ? 'green' : 'amber'}`}><span className="pd" />{n.published ? t('news.published') : t('news.draft')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button className="btn sm"><Pencil size={11} /> {t('common.edit')}</button>
                    <button className={`btn sm ${n.published ? 'danger' : 'primary'}`} onClick={() => onToggleNews(n.id)}>
                      {n.published ? t('news.unpublish') : t('news.publish')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
