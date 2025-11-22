'use client';

import { FormEvent, useMemo, useState } from 'react';

type ScriptMeta = {
  title: string;
  genre: string;
  logline: string;
  tone: string;
  format: string;
  targetRuntime: number;
};

type CharacterProfile = {
  id: string;
  name: string;
  archetype: string;
  objective: string;
  arc: string;
};

type SceneBeat = {
  id: string;
  act: 'Act I' | 'Act II' | 'Act III';
  heading: string;
  location: string;
  conflict: string;
  emotionalShift: string;
  duration: number;
  purpose: string;
};

type SceneBucket = {
  label: SceneBeat['act'];
  scenes: SceneBeat[];
};

const acts: SceneBeat['act'][] = ['Act I', 'Act II', 'Act III'];

const createId = () => Math.random().toString(36).slice(2, 11);

export default function HomePage() {
  const [meta, setMeta] = useState<ScriptMeta>({
    title: '',
    genre: '',
    logline: '',
    tone: '',
    format: 'Feature Film',
    targetRuntime: 110
  });

  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [characterDraft, setCharacterDraft] = useState<Omit<CharacterProfile, 'id'>>({
    name: '',
    archetype: '',
    objective: '',
    arc: ''
  });

  const [scenes, setScenes] = useState<SceneBeat[]>([]);
  const [sceneDraft, setSceneDraft] = useState<Omit<SceneBeat, 'id'>>({
    act: 'Act I',
    heading: '',
    location: '',
    conflict: '',
    emotionalShift: '',
    duration: 3,
    purpose: ''
  });

  const [directorNotes, setDirectorNotes] = useState<string>('');

  const metrics = useMemo(() => {
    const totalScenes = scenes.length;
    const totalMinutes = scenes.reduce((minutes, scene) => minutes + scene.duration, 0);
    const midpointScene = scenes.find((scene) => scene.act === 'Act II');
    const beatsBalance = acts.map((act) => ({
      act,
      scenes: scenes.filter((scene) => scene.act === act).length
    }));

    const characterCoverage = characters.reduce((acc, character) => {
      const mentionedScenes = scenes.filter((scene) =>
        scene.purpose.toLowerCase().includes(character.name.toLowerCase())
      ).length;
      return acc + (mentionedScenes > 0 ? 1 : 0);
    }, 0);

    return {
      totalScenes,
      totalMinutes,
      midpointScene,
      beatsBalance,
      perScenePacing: totalScenes ? Number((meta.targetRuntime / totalScenes).toFixed(1)) : 0,
      coverage: characters.length
        ? Math.round((characterCoverage / characters.length) * 100)
        : 0
    };
  }, [scenes, characters, meta.targetRuntime]);

  const buckets: SceneBucket[] = useMemo(
    () =>
      acts.map((act) => ({
        label: act,
        scenes: scenes
          .filter((scene) => scene.act === act)
          .sort((a, b) => a.heading.localeCompare(b.heading))
      })),
    [scenes]
  );

  const summaryInsight = useMemo(() => {
    if (!scenes.length) {
      return 'ابدأ بإضافة مشاهد لكل فصل ثم اربطها بأهداف الشخصيات لتكوين منحنى درامي متماسك.';
    }

    const opening = scenes.find((scene) => scene.act === 'Act I');
    const finale = scenes
      .filter((scene) => scene.act === 'Act III')
      .slice(-1)
      .pop();

    return [
      opening
        ? `الافتتاح: "${opening.heading}" يهيئ العالم ويعرض الصراع من خلال ${opening.purpose ||
            'هدف المشهد'}.`
        : 'أضف مشهد افتتاحي يمهد للقصة والجاذبية البصرية.',
      metrics.midpointScene
        ? `نقطة التحول: "${metrics.midpointScene.heading}" يجب أن يقلب الاتجاه السينمائي ويدفع البطل لاتخاذ قرار حاسم.`
        : 'أدرج نقطة تحول درامية في منتصف الفيلم لتحافظ على شد انتباه الجمهور.',
      finale
        ? `الخاتمة: "${finale.heading}" تختم الأقواس الدرامية وتمنح نهاية مرضية للنزاع الأساسي.`
        : 'حدد خاتمة تبرز أثر الرحلة على كل شخصية رئيسية.'
    ].join(' ');
  }, [scenes, metrics.midpointScene]);

  const handleMetaChange = (field: keyof ScriptMeta, value: string) => {
    setMeta((prev) => ({
      ...prev,
      [field]: field === 'targetRuntime' ? Number(value) : value
    }));
  };

  const handleAddCharacter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!characterDraft.name.trim()) {
      return;
    }

    setCharacters((prev) => [
      ...prev,
      {
        id: createId(),
        ...characterDraft
      }
    ]);

    setCharacterDraft({
      name: '',
      archetype: '',
      objective: '',
      arc: ''
    });
  };

  const handleAddScene = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sceneDraft.heading.trim()) {
      return;
    }

    setScenes((prev) => [
      ...prev,
      {
        id: createId(),
        ...sceneDraft
      }
    ]);

    setSceneDraft({
      act: sceneDraft.act,
      heading: '',
      location: '',
      conflict: '',
      emotionalShift: '',
      duration: sceneDraft.duration,
      purpose: ''
    });
  };

  return (
    <main className="app-shell">
      <div className="topbar">
        <div>
          <h1>Film Scenario Architect</h1>
          <p className="subtitle">
            صمم خطط تصوير كاملة من خلال تنظيم الشخصيات، الأقسام الدرامية، والمشاهد المفصلة.
          </p>
        </div>
        <span className="badge">Ready for Production</span>
      </div>

      <div className="section-card">
        <h2>Project Blueprint</h2>
        <div className="grid-two">
          <div className="field">
            <label htmlFor="title">العنوان</label>
            <input
              id="title"
              className="input"
              value={meta.title}
              onChange={(event) => handleMetaChange('title', event.target.value)}
              placeholder="عنوان الفيلم"
            />
          </div>
          <div className="field">
            <label htmlFor="genre">النوع السينمائي</label>
            <input
              id="genre"
              className="input"
              value={meta.genre}
              onChange={(event) => handleMetaChange('genre', event.target.value)}
              placeholder="خيال علمي، دراما، تشويق..."
            />
          </div>
          <div className="field">
            <label htmlFor="format">الصيغة</label>
            <input
              id="format"
              className="input"
              value={meta.format}
              onChange={(event) => handleMetaChange('format', event.target.value)}
              placeholder="فيلم طويل، مسلسل قصير..."
            />
          </div>
          <div className="field">
            <label htmlFor="runtime">المدة المستهدفة (دقيقة)</label>
            <input
              id="runtime"
              className="input"
              type="number"
              min={30}
              max={240}
              value={meta.targetRuntime}
              onChange={(event) => handleMetaChange('targetRuntime', event.target.value)}
            />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="logline">Logline</label>
            <textarea
              id="logline"
              className="textarea"
              value={meta.logline}
              onChange={(event) => handleMetaChange('logline', event.target.value)}
              placeholder="جملة تلخص حبكة الفيلم والصراع المركزي."
            />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="tone">النبرة البصرية والعاطفية</label>
            <textarea
              id="tone"
              className="textarea"
              value={meta.tone}
              onChange={(event) => handleMetaChange('tone', event.target.value)}
              placeholder="حدد مزاج الفيلم، لوحة الألوان، والإيقاع السردي."
            />
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="grid-two">
        <section className="section-card">
          <h2>Character Lab</h2>
          <form className="list-stack" onSubmit={handleAddCharacter}>
            <div className="field">
              <label htmlFor="character-name">الاسم</label>
              <input
                id="character-name"
                className="input"
                value={characterDraft.name}
                onChange={(event) =>
                  setCharacterDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="اسم الشخصية"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="character-archetype">الدور / القالب</label>
              <input
                id="character-archetype"
                className="input"
                value={characterDraft.archetype}
                onChange={(event) =>
                  setCharacterDraft((prev) => ({ ...prev, archetype: event.target.value }))
                }
                placeholder="البطل، الخصم، المرشد..."
              />
            </div>
            <div className="field">
              <label htmlFor="character-objective">الهدف الدرامي</label>
              <textarea
                id="character-objective"
                className="textarea"
                value={characterDraft.objective}
                onChange={(event) =>
                  setCharacterDraft((prev) => ({ ...prev, objective: event.target.value }))
                }
                placeholder="ماذا تريد الشخصية ولماذا؟"
              />
            </div>
            <div className="field">
              <label htmlFor="character-arc">منحنى التطور</label>
              <textarea
                id="character-arc"
                className="textarea"
                value={characterDraft.arc}
                onChange={(event) =>
                  setCharacterDraft((prev) => ({ ...prev, arc: event.target.value }))
                }
                placeholder="كيف تتغير الشخصية عبر الفصول؟"
              />
            </div>
            <button className="button" type="submit">
              إضافة شخصية
            </button>
          </form>
          <div className="divider" />
          {characters.length ? (
            <div className="list-stack">
              {characters.map((character) => (
                <div key={character.id} className="list-item">
                  <div>
                    <strong>{character.name}</strong>
                    <p>{character.objective || 'حدد هدف الشخصية لبناء الصراع.'}</p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 160 }}>
                    {character.archetype && <small>{character.archetype}</small>}
                    {character.arc && (
                      <p style={{ margin: '4px 0 0', color: '#cbd5f5' }}>{character.arc}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">أضف شخصياتك الأساسية لتخطيط الأقواس الدرامية.</div>
          )}
        </section>

        <section className="section-card">
          <h2>Scene Builder</h2>
          <form className="list-stack" onSubmit={handleAddScene}>
            <div className="grid-two">
              <div className="field">
                <label htmlFor="scene-act">الفصل</label>
                <select
                  id="scene-act"
                  className="input"
                  value={sceneDraft.act}
                  onChange={(event) =>
                    setSceneDraft((prev) => ({
                      ...prev,
                      act: event.target.value as SceneBeat['act']
                    }))
                  }
                >
                  {acts.map((actOption) => (
                    <option key={actOption} value={actOption}>
                      {actOption}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="scene-duration">المدة التقديرية</label>
                <input
                  id="scene-duration"
                  className="input"
                  type="number"
                  min={1}
                  max={15}
                  value={sceneDraft.duration}
                  onChange={(event) =>
                    setSceneDraft((prev) => ({
                      ...prev,
                      duration: Number(event.target.value)
                    }))
                  }
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="scene-heading">عنوان المشهد (Slugline)</label>
              <input
                id="scene-heading"
                className="input"
                value={sceneDraft.heading}
                onChange={(event) =>
                  setSceneDraft((prev) => ({ ...prev, heading: event.target.value }))
                }
                placeholder="INT. LOCATION - TIME"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="scene-location">الوصف البصري للمكان</label>
              <textarea
                id="scene-location"
                className="textarea"
                value={sceneDraft.location}
                onChange={(event) =>
                  setSceneDraft((prev) => ({ ...prev, location: event.target.value }))
                }
                placeholder="صف المكان والجو العام، عناصر الإنتاج، الإضاءة..."
              />
            </div>
            <div className="field">
              <label htmlFor="scene-purpose">الغرض الدرامي</label>
              <textarea
                id="scene-purpose"
                className="textarea"
                value={sceneDraft.purpose}
                onChange={(event) =>
                  setSceneDraft((prev) => ({ ...prev, purpose: event.target.value }))
                }
                placeholder="ما الذي يجب أن يتغير أو يُكشف في هذا المشهد؟"
              />
            </div>
            <div className="field">
              <label htmlFor="scene-conflict">التصاعد والصراع</label>
              <textarea
                id="scene-conflict"
                className="textarea"
                value={sceneDraft.conflict}
                onChange={(event) =>
                  setSceneDraft((prev) => ({ ...prev, conflict: event.target.value }))
                }
                placeholder="التحديات، العقبات، والمفاجآت."
              />
            </div>
            <div className="field">
              <label htmlFor="scene-shift">التحول العاطفي</label>
              <textarea
                id="scene-shift"
                className="textarea"
                value={sceneDraft.emotionalShift}
                onChange={(event) =>
                  setSceneDraft((prev) => ({ ...prev, emotionalShift: event.target.value }))
                }
                placeholder="كيف يتغير الشعور في نهاية المشهد؟"
              />
            </div>
            <button className="button" type="submit">
              إضافة مشهد
            </button>
          </form>
          <div className="divider" />
          {scenes.length ? (
            <div className="scene-grid">
              {scenes.map((scene) => (
                <div key={scene.id} className="scene-card">
                  <span>{scene.act}</span>
                  <h3>{scene.heading}</h3>
                  {scene.location && <p>{scene.location}</p>}
                  {scene.purpose && (
                    <p>
                      <strong>الغرض:</strong> {scene.purpose}
                    </p>
                  )}
                  {scene.conflict && (
                    <p>
                      <strong>الصراع:</strong> {scene.conflict}
                    </p>
                  )}
                  {scene.emotionalShift && (
                    <p>
                      <strong>التحول:</strong> {scene.emotionalShift}
                    </p>
                  )}
                  <small>{scene.duration} دقيقة</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">ابنِ سيناريوك عبر إضافة مشاهد مرتبة حسب الفصول.</div>
          )}
        </section>
      </div>

      <div className="divider" />

      <section className="section-card">
        <h2>Story Metrics</h2>
        <div className="metrics">
          <div className="metric-card">
            <span>عدد المشاهد</span>
            <strong>{metrics.totalScenes}</strong>
          </div>
          <div className="metric-card">
            <span>المدة التقديرية</span>
            <strong>{metrics.totalMinutes} دقيقة</strong>
          </div>
          <div className="metric-card">
            <span>الإيقاع لكل مشهد</span>
            <strong>{metrics.perScenePacing || '—'} دقيقة</strong>
          </div>
          <div className="metric-card">
            <span>تغطية الشخصيات</span>
            <strong>{metrics.coverage || 0}%</strong>
          </div>
        </div>
        <div className="insight" style={{ marginTop: 20 }}>
          <strong>ملاحظات درامية</strong>
          <p>{summaryInsight}</p>
        </div>
      </section>

      <div className="divider" />

      <section className="section-card">
        <h2>Act Breakdown</h2>
        <div className="grid-two">
          {buckets.map((bucket) => (
            <div key={bucket.label} className="list-stack">
              <div className="metric-card">
                <span>{bucket.label}</span>
                <strong>{bucket.scenes.length} مشهد</strong>
              </div>
              {bucket.scenes.length ? (
                bucket.scenes.map((scene) => (
                  <div key={scene.id} className="list-item">
                    <div>
                      <strong>{scene.heading}</strong>
                      <p>{scene.purpose || 'حدد الوظيفة السردية للمشهد.'}</p>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 140 }}>
                      <small>{scene.duration} دقيقة</small>
                      {scene.emotionalShift && (
                        <p style={{ margin: '4px 0 0', color: '#cbd5f5' }}>
                          {scene.emotionalShift}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">لا توجد مشاهد مضافة لهذا الفصل حتى الآن.</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section className="section-card">
        <h2>Director Notes</h2>
        <textarea
          className="textarea"
          value={directorNotes}
          onChange={(event) => setDirectorNotes(event.target.value)}
          placeholder="جمع التوجيهات الفنية، متطلبات الإنتاج، والملاحظات الإخراجية."
          rows={6}
        />
      </section>
    </main>
  );
}
