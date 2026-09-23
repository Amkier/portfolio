import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import ClickSpark from './ClickSpark';
import AccordionGallery from './AccordionGallery';
import usePortfolioMotion from './usePortfolioMotion';
import useHeroVideo from './useHeroVideo';

const email = 'J1978520369700@163.com';
const projects = [
  { id:'01', name:'AMK 人体工学静音鼠标', subtitle:'在舒适与便携之间，找到平衡。', type:'产品设计 / 办公体验', tags:['人体工学','模块化设计','CMF'], image:'/projects/mouse-cover.jpg', className:'mouse', summary:'面向移动办公与学习场景，探索人体工学、便携性与视觉简洁之间的平衡。以透明支撑壳体与独立鼠标模块形成组合，兼顾桌面使用的握持支撑和外出携带的轻量需求。', role:'从用户研究、痛点分析、用户画像与竞品比较出发，推敲模块化形态，并通过产品渲染、CMF 与使用场景表达方案。', tools:'舒适握持 · 静音触控 · 桌面 / 便携双模式', pages:[4,5,6,7,8,9,10,11,12], captions:['项目概览','项目特点与设计命题','用户研究','用户痛点分析','用户画像','竞品分析','产品效果图','CMF：色彩、材质与工艺','桌面与便携使用场景'] },
  { id:'02', name:'AMK 公共场所禁烟机器人', subtitle:'巡逻、劝阻、清洁，守护无烟环境。', type:'产品设计 / 公共服务', tags:['服务场景','结构设计','CMF'], image:'/projects/robot-cover.jpg', className:'robot', summary:'面向公共禁烟区域，提出集吸烟行为识别、警示与语音劝阻、烟头回收、清洁及空气净化于一体的服务机器人设计。通过巡逻与定点待机两种状态，回应公共空间的环境维护需求。', role:'结合场景痛点、用户画像和用户旅程，梳理服务流程与功能分区，完成外观、结构爆炸图、CMF 及公共场景展示。', tools:'智能巡逻 · 禁烟劝阻 · 烟头回收 · 空气净化', pages:[13,14,15,16,17,18,19,20], captions:['项目概览','设计思考与解决方案','用户痛点分析','用户画像','用户旅程图','爆炸图与 CMF 分析','公共场所应用场景','净化、清扫与烟头回收'] },
  { id:'03', name:'便携式手语翻译设备', subtitle:'让手语被理解，让交流更自然。', type:'产品设计 / 无障碍沟通', tags:['领夹式设计','可穿戴设备','无障碍体验'], image:'/projects/translator-cover.jpg', className:'translator', summary:'围绕手语使用者与非手语使用者的面对面交流，探索轻量化领夹式翻译设备。方案结合手语动作捕捉、语义转换与语音输出，并设置内置耳机，以回应安静环境与私密交流中的使用需求。', role:'从交流中的中断、依赖第三方和隐私需求切入，梳理双方用户旅程，形成领夹佩戴、耳机收纳、CMF 和一体化轻量设计方案。', tools:'手语识别 · 语音翻译 · 私密输出 · Type-C 充电', pages:[21,22,23,24,25,26,27,28,29], captions:['项目背景','用户痛点分析','设计缘起与目标','产品功能特点','手语使用者旅程','交流接收方旅程','CMF 分析','面对面交流场景','一体化轻量设计'] },
  { id:'04', name:'宠物智能陪伴 App', subtitle:'陪伴不一定要带回家，也可以很温暖。', type:'交互设计 / 宠物陪伴', tags:['用户旅程','UI 设计规范','远程陪伴'], image:'/projects/pet-cover.jpg', className:'pet', summary:'面向喜爱宠物却受时间、空间与生活节奏限制的年轻人，探索更轻松的陪伴方式。通过宠物认养、状态查看、成长记录与实时监控，让用户在忙碌日常之外保持与宠物的情感连接。', role:'围绕用户痛点梳理认养与陪伴流程，建立首页 UI 规范，展示首页、社区、我的宠物、宠物商城及个人中心，并设计宠物详情和实时监控等二级界面。', tools:'情感连接 · 轻负担养宠 · 状态查看 · 成长记录', pages:[30,31,32,33,34,35,36], captions:['项目背景','用户痛点分析','认养与陪伴用户旅程','UI 界面设计规范','主要界面展示','宠物详情与实时监控','使用场景展示'] },
];
const strengths = [
  ['01','从观察，到洞察。','用户与场景研究','结合设计心理学与人机工程学，从具体的使用情境出发，将用户需求转化为设计问题。','Research / Define'],
  ['02','让想法，有形可见。','造型与 CMF 表达','通过曲面建模、材质推敲和场景渲染，探索形态、色彩与触感之间的关系。','Rhino / KeyShot / Photoshop'],
  ['03','不止外观，更进一步。','结构与交互原型','结合结构设计、参数化建模与 Arduino ESP32 原型，关注产品落地的可行性。','Creo / Arduino ESP32'],
  ['04','在跨界中，持续生长。','数字体验与 AI 辅助','使用 Figma 梳理信息架构和交互流程，借助 AI 辅助构思与表达，持续拓展设计工具箱。','Figma / AI-assisted Design'],
];

import Arrow from './Arrow';
function ProjectDialog({ project, close }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.showModal(); const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = old; }; }, []);
  return <dialog ref={ref} className="project-dialog" onCancel={close} onClick={e => e.target === ref.current && close()} aria-labelledby="project-title">
    <button className="dialog-close" onClick={close} aria-label="关闭项目详情">×</button>
    <div className="dialog-body"><span className="eyebrow">PROJECT {project.id} / {project.type}</span><h2 id="project-title">{project.name}</h2><p className="dialog-lead">{project.subtitle}</p><p>{project.summary}</p><div className="detail-row"><span>设计内容</span><p>{project.role}</p></div><div className="detail-row"><span>设计关键词</span><p>{project.tools}</p></div><div className="detail-note">作品图片与以下设计过程均来自我的 PDF 作品集，第 {project.pages[0]}–{project.pages.at(-1)} 页。</div><a className="pill dark" href={`mailto:${email}?subject=${encodeURIComponent('关于作品：'+project.name)}`}>交流这个项目 <Arrow/></a></div>
    <div className="project-gallery" aria-label={`${project.name}设计过程`}>
      <div className="gallery-heading"><h3>从问题，到设计。</h3><span>DESIGN PROCESS / {project.pages.length} PAGES</span></div>
      {project.pages.map((page, index)=><figure key={page}><figcaption><span>{String(index+1).padStart(2,'0')} / {project.captions[index]}</span><a href={`/projects/page-${String(page).padStart(2,'0')}.jpg`} target="_blank" rel="noreferrer" aria-label={`新窗口查看${project.captions[index]}原图`}>查看原图 <Arrow/></a></figcaption><img src={`/projects/page-${String(page).padStart(2,'0')}.webp`} srcSet={`/projects/page-${String(page).padStart(2,'0')}-960.webp 960w, /projects/page-${String(page).padStart(2,'0')}.webp 1920w`} sizes="(max-width: 700px) 90vw, 1100px" decoding="async" alt={`${project.name}：${project.captions[index]}，作品集第 ${page} 页`} loading="lazy" width="1920" height="1080"/></figure>)}
    </div>
    <ClickSpark />
  </dialog>;
}
function App() {
  usePortfolioMotion();
  const [project, setProject] = useState(null);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState('');
  const [sideNav, setSideNav] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const header = useRef(null);
  const video = useRef(null);
  const { playing, toggle: toggleVideo } = useHeroVideo(video);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setSideNav(!entry.isIntersecting);
      if (!entry.isIntersecting) setMenu(false);
    });
    observer.observe(header.current);
    let frame;
    const sections = [...document.querySelectorAll('main > section[id]')];
    let offsets = [];
    const measure = () => { offsets = sections.map(section => ({ id: section.id, top: section.getBoundingClientRect().top + scrollY })); update(); };
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const current = offsets.filter(section => section.top <= scrollY + innerHeight * .38).at(-1);
        setActiveSection(current?.id || 'home');
      });
    };
    const layoutObserver = new ResizeObserver(measure);
    sections.forEach(section => layoutObserver.observe(section));
    measure();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', measure); layoutObserver.disconnect(); };
  }, []);
  async function copyEmail() { try { await navigator.clipboard.writeText(email); setCopied('邮箱已复制'); } catch { setCopied('请选中邮箱地址复制'); } setTimeout(()=>setCopied(''), 3000); }
  return <>
    <div className="opening-screen" aria-hidden="true"><div className="opening-panel"/><div className="opening-panel"/><div className="opening-lockup"><span className="opening-word">LIU JIACHENG</span><div className="opening-rule"/></div></div>
    <a className="skip-link" href="#about">跳至主要内容</a>
    <header ref={header} className="header wrap"><a href="#home" className="brand" aria-label="刘嘉成 首页">JIA<span>CHENG</span><b>®</b></a><button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="navigation">{menu?'关闭':'菜单'} <span>{menu?'−':'+'}</span></button><nav id="navigation" className={menu?'nav open':'nav'} aria-label="主导航"><a onClick={()=>setMenu(false)} href="#about">关于我 <small>About</small></a><a onClick={()=>setMenu(false)} href="#work">精选作品 <small>Work</small></a><a onClick={()=>setMenu(false)} href="#strengths">设计能力 <small>Expertise</small></a></nav><a className="pill contact-nav" href="#contact">聊聊设计 <Arrow/></a></header>
    {sideNav && !project && <nav className="floating-nav" aria-label="侧边导航">
      {[['home','↑','首页'],['about','01','关于'],['work','02','作品'],['strengths','03','能力'],['contact','04','联系']].map(([id,number,label])=><a key={id} href={`#${id}`} className={activeSection===id?'is-active':''} aria-current={activeSection===id?'location':undefined} aria-label={`前往${label}`}><span className="floating-number" aria-hidden="true">{number}</span><span>{label}</span></a>)}
    </nav>}
    <main>
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-visual"><video ref={video} className="hero-video" muted loop playsInline preload="none" poster="/projects/hero-robot.webp" aria-label="AMK 机器人作品视频"/><div className="hero-wash"/></div>
      <div className="hero-inner wrap">
        <div className="hero-topline"><span>LIU JIACHENG<br/>INDUSTRIAL DESIGNER</span><span>SELECTED WORKS<br/>2023 — 2026</span></div>
        <div className="hero-copy"><div className="hero-edition"><span>设计，回应日常。</span><span>VOL. 01 / 2026</span></div><h1 id="hero-title" aria-label="PORTFOLIO"><span aria-hidden="true">{[...'PORTFOLIO.'].map((char,i)=><span key={i} className={`hero-title-char ${char==='.'?'title-period':''}`}>{char}</span>)}</span></h1><div className="hero-caption"><div><h2>刘嘉成 <span>LIU JIACHENG</span></h2><p>以设计，连接更美好的生活。</p></div><a href="#work" className="hero-explore" aria-label="探索我的作品"><Arrow/></a></div><div className="hero-disciplines"><span>产品设计 / CMF / 交互体验</span><a href={`mailto:${email}`}>{email}</a></div></div>
        <div className="hero-bottom"><div className="hero-object-caption"><span>02 — AMK</span><span>公共场所禁烟机器人 / 作品视频</span></div><a href="#about" className="scroll-link">SCROLL TO EXPLORE <span>↓</span></a><button className="motion-toggle" onClick={toggleVideo} aria-label={playing?'暂停背景视频':'播放背景视频'}>{playing?'Ⅱ':'▷'} <span>{playing?'暂停影像':'播放影像'}</span></button></div>
      </div>
    </section>

    <section id="about" className="about section wrap about-editorial" aria-labelledby="about-title">
      <div className="bio-layout">
        <div className="bio-content">
          <div className="bio-heading"><span aria-hidden="true">ABOUT ME</span><h2 id="about-title">个人简介</h2></div>
          <div className="bio-identity"><h3>刘嘉成<span>LIU JIACHENG</span></h3><p>工业设计本科在读 / 中国矿业大学 / 宁夏中卫</p></div>
          <p className="bio-intro">从用户需求与场景出发，让想法成为有温度的产品。<br/>关注产品造型、CMF、结构与交互，在理性思考与感性表达之间探索设计。</p>
          <div className="bio-experiences">
            <article><div className="bio-entry-title"><h4>中国矿业大学 · 工业设计</h4><span>2023.09 — 2027.06</span></div><span className="bio-entry-en">EDUCATION / UNDERGRADUATE</span><p>系统学习 CMF 设计、产品结构设计、交互产品设计、人机工程学与设计心理学，建立从研究到视觉呈现的产品设计流程意识。</p></article>
            <article><div className="bio-entry-title"><h4>企业认知实习</h4><span>行业实践</span></div><span className="bio-entry-en">INDUSTRY OBSERVATION & PRACTICE</span><p>通过企业参访、案例学习与流程观察，了解产品设计、制造流程与跨部门协作，将课堂中的设计思考带入真实产业场景。</p></article>
            <article><div className="bio-entry-title"><h4>ISPO Shanghai 上海国际体育用品展</h4><span>2025</span></div><span className="bio-entry-en">MATERIALS / CRAFT / INNOVATION</span><p>关注运动装备、材料工艺、功能创新与品牌展示趋势，通过案例调研与记录，积累对材料和工艺的认识。</p></article>
          </div>
          <div className="bio-tools" aria-label="设计工具"><span>TOOLS</span>{['Rhino','KeyShot','Creo','Photoshop','Figma','AI 辅助设计'].map(tool=><span key={tool}>{tool}</span>)}</div>
          <div className="bio-bottom"><span>04 <small>精选项目</small></span><a href="#work">查看我的作品 <Arrow/></a></div>
        </div>
        <div className="bio-visual">
          <span className="bio-number" aria-hidden="true">01</span>
          <div className="portrait-frame bio-portrait"><img src="/images/portrait-color.webp" alt="刘嘉成的彩色证件照" loading="lazy" decoding="async" width="1279" height="1919"/></div>
          <span className="bio-square" aria-hidden="true"/>
          <div className="bio-designer"><span>INDUSTRIAL</span><strong>DESIGNER</strong><span className="bio-designer-arrow" aria-hidden="true">↙</span></div>
          <div className="bio-contact"><a href="tel:15008656394"><span>TEL</span>150 0865 6394</a><a href={`mailto:${email}`}><span>EMAIL</span>{email}</a><span className="bio-location">BASED IN / 宁夏 · 中卫</span></div>
        </div>
      </div>
    </section>
    <section id="work" className="work section wrap work-exhibition" aria-labelledby="work-title">
      <div className="section-marker"><span>02 / SELECTED WORK</span><span>从日常出发，让想法成形。</span></div>
      <div className="summary-heading"><span>SELECTED WORKS / 2026</span><h2 id="work-title">SUMMARY</h2><p>四个项目，四种关于日常的设计思考。</p></div>
      <AccordionGallery items={projects.map((p,i)=>({...p, image:['/projects/page-10.webp','/projects/page-19.webp','/projects/page-29.webp','/projects/page-34.webp'][i],shortName:['静音鼠标','禁烟机器人','手语翻译','宠物陪伴'][i]}))} onOpen={setProject}/>
      <div className="summary-footer"><span>LIU JIACHENG / INDUSTRIAL DESIGN</span><span>悬浮或轻触展开 · 查看设计过程 ↗</span></div>    </section>

    <section id="strengths" className="strengths section" aria-labelledby="strength-title"><div className="wrap"><div className="section-marker"><span>03 / MY APPROACH</span><span>从想法，到可行的方案。</span></div><div className="motion-section-title" aria-hidden="true">EXPERTISE</div><div className="section-heading"><h2 id="strength-title">把灵感，<br/>变成<span className="serif">解决方案。</span></h2><p>兼顾设计逻辑、使用体验与落地可行性，<br/>在每一次实践中，完善自己的设计方法。</p></div><div className="strength-grid">{strengths.map(s=><article className="strength-card" key={s[0]}><div className="strength-top"><span>{s[0]}</span><span className="strength-symbol" aria-hidden="true">{['◎','◈','⊞','✳'][Number(s[0])-1]}</span></div><span className="strength-label">{s[2]}</span><h3>{s[1]}</h3><p>{s[3]}</p><span className="tool-list">{s[4]}</span></article>)}</div><div className="design-note"><span>MY DESIGN BELIEF</span><p>好的设计，始于对生活的<span>认真观察。</span></p></div></div></section>

    <section id="contact" className="contact-section" aria-labelledby="contact-title"><div className="wrap contact-inner"><div className="section-marker"><span>04 / GET IN TOUCH</span><span>下一段设计故事，从这里开始。</span></div><div className="contact-main"><div className="motion-section-title" aria-hidden="true">LET’S TALK.</div><span className="eyebrow">LET’S MAKE SOMETHING MEANINGFUL.</span><h2 id="contact-title">期待与你，<br/>创造<span className="serif">新的可能。</span><span className="accent-dot">*</span></h2><div className="contact-row"><p>欢迎交流设计想法、项目合作与实习机会。<br/>关于产品，关于生活，都可以聊聊。</p><a className="contact-circle" href={`mailto:${email}`} aria-label="给刘嘉成发送邮件"><Arrow/></a></div><div className="contact-details"><div><span>EMAIL</span><a href={`mailto:${email}`}>{email}</a><button onClick={copyEmail} className="copy-button" aria-label="复制邮箱地址">复制邮箱 <Arrow/></button><span className="copy-status" role="status">{copied}</span></div><div><span>PHONE</span><a href="tel:15008656394">+86 150 0865 6394</a></div><div><span>BASED IN</span><p>中国 · 宁夏中卫</p></div></div></div><footer><a className="brand" href="#home">JIA<span>CHENG</span><b>®</b></a><span>© {new Date().getFullYear()} 刘嘉成 · 用设计回应生活</span><a className="back-top" href="#home">回到顶部 ↑</a></footer></div></section>
    </main>{project && <ProjectDialog key={project.id} project={project} close={()=>setProject(null)}/>}
  </>;
}
createRoot(document.getElementById('root')).render(<ClickSpark><App/></ClickSpark>);


import './blue-theme.css';









import './motion.css';

import './actions.css';

