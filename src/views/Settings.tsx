import { useState } from 'react';
import { Check } from 'lucide-react';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';

interface Props { state: AppState; onSave: () => void; }

type SettingsTab = 'general' | 'waste' | 'ecopoints' | 'notifications' | 'map' | 'ai';

export default function Settings({ state, onSave }: Props) {
  const t = useT(state.lang);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: 'general',       label: t('settings.general') },
    { key: 'waste',         label: t('settings.waste') },
    { key: 'ecopoints',     label: t('settings.ecopoints_s') },
    { key: 'notifications', label: t('settings.notifications') },
    { key: 'map',           label: t('settings.map_s') },
    { key: 'ai',            label: t('settings.ai') },
  ];

  return (
    <div className="rise">
      <div className="tabs">
        {tabs.map(tab => (
          <div key={tab.key} className={`tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</div>
        ))}
      </div>
      <div className="card">
        <div className="card-b">
          <div className="field-grid">
            {activeTab === 'general' && <>
              <div><label className="label">{t('settings.platform_name')}</label><input className="input" defaultValue="Punto Vivo Bogotá" /></div>
              <div><label className="label">{t('settings.default_lang')}</label><select className="select"><option>Español</option><option>English</option></select></div>
              <div><label className="label">{t('settings.timezone')}</label><input className="input" defaultValue="America/Bogota (UTC-5)" /></div>
              <div><label className="label">{t('settings.currency')}</label><input className="input" defaultValue="COP — Colombian Peso" /></div>
            </>}
            {activeTab === 'waste' && <>
              <div><label className="label">{t('settings.ai_threshold')}</label><input className="input" type="number" defaultValue="0.75" step="0.05" /></div>
              <div><label className="label">{t('settings.collect_dist')}</label><input className="input" type="number" defaultValue="5" step="0.5" /></div>
            </>}
            {activeTab === 'ecopoints' && <>
              <div><label className="label">{t('settings.cap_warn')}</label><input className="input" type="number" defaultValue="70" /></div>
              <div><label className="label">{t('settings.full_thresh')}</label><input className="input" type="number" defaultValue="95" /></div>
            </>}
            {activeTab === 'notifications' && <>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('settings.push_notif')}</label>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('settings.email_notif')}</label>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" /> {t('settings.sms_notif')}</label>
              </div>
            </>}
            {activeTab === 'map' && <>
              <div><label className="label">{t('settings.map_provider')}</label><select className="select"><option>Leaflet (OpenStreetMap)</option><option>Mapbox GL JS</option><option>Google Maps</option></select></div>
              <div><label className="label">{t('settings.default_coords')}</label><input className="input" defaultValue="4.7110, -74.0721" /></div>
              <div><label className="label">{t('settings.track_interval')}</label><input className="input" type="number" defaultValue="5" /></div>
            </>}
            {activeTab === 'ai' && <>
              <div><label className="label">{t('settings.ollama_endpoint')}</label><input className="input" defaultValue="http://localhost:11434" /></div>
              <div><label className="label">{t('settings.model')}</label><input className="input" defaultValue="llama3.1:8b" /></div>
              <div><label className="label">{t('settings.timeout')}</label><input className="input" type="number" defaultValue="30000" /></div>
              <div><label className="label">{t('settings.confidence')}</label><input className="input" type="number" defaultValue="0.75" step="0.05" /></div>
            </>}
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className="btn">{t('common.cancel')}</button>
            <button className="btn primary" onClick={onSave}><Check size={14} /> {t('common.save')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
