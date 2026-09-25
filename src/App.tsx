import { useEffect } from 'react'
import { campus, experiences, interests, projects, skills } from './content/profile'
import './App.css'

const nav = [
  { label: '关于', href: '#top' },
  { label: '核心能力', href: '#skills' },
  { label: '重点项目', href: '#projects' },
  { label: '工作经历', href: '#experience' },
  { label: '教育与更多', href: '#about-more' },
  { label: '联系', href: '#contact' },
]

function SectionHeading({ id, marker, title }: { id: string; marker: string; title: string }) {
  return <div className="section-heading"><span className="section-marker" aria-hidden="true">{marker}</span><h2 id={id} tabIndex={-1}>{title}</h2></div>
}

function App() {
  useEffect(() => {
    // Leave history and scrolling to the browser; focus only existing in-page targets.
    const focusHash = () => {
      let id: string
      try {
        id = decodeURIComponent(window.location.hash.slice(1))
      } catch {
        return
      }
      if (id) document.getElementById(id)?.focus({ preventScroll: true })
    }
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]')
      if (link) requestAnimationFrame(focusHash)
    }
    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', focusHash)
    if (window.location.hash) requestAnimationFrame(focusHash)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', focusHash)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className="site-header container">
        <span className="wordmark">邓易丰 <span aria-hidden="true">/</span> Alan</span>
        <nav aria-label="站点导航"><ul>{nav.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}</ul></nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section className="hero container" aria-labelledby="top">
          <div className="hero-copy">
            <p className="hero-kicker">HR × AI Agent</p>
            <h1 id="top" tabIndex={-1}>Alan<span className="hero-divider" aria-hidden="true">｜</span>邓易丰</h1>
            <p className="hero-subtitle">人力资源数字化实践者｜HR + AI Agent复合型人才</p>
            <div className="hero-actions"><a className="button button-primary" href="#projects">查看重点项目</a><a className="button button-secondary" href="#contact">联系我</a></div>
            <p className="hero-contact">直接联系：<a href="tel:18173959893">18173959893</a><span>（将调用设备拨号应用）</span></p>
            <p className="hero-description">深耕传统人力资源全模块业务，擅长Graph编排、人事Skill开发、智能体产品落地、团队AI梯队搭建。专注以人工智能解决真实HR业务痛点，实现业务降本与效率创新。</p>
          </div>
          <div className="hero-aside" aria-hidden="true"><span>HR 实务</span><span>Agent 落地</span><span>团队赋能</span><div className="aside-rule" /></div>
        </section>

        <section className="section container" aria-labelledby="skills">
          <SectionHeading id="skills" marker="能力" title="从人事现场到数字化落地" />
          <div className="skills-grid">{skills.map((skill) => <article className="skill" key={skill.title}><h3>{skill.title}</h3><p>{skill.text}</p></article>)}</div>
        </section>

        <section className="section projects-section" aria-labelledby="projects"><div className="container">
          <SectionHeading id="projects" marker="实践" title="重点项目" />
          <p className="section-lead">四项来自京东集团共享服务中心任职期间的人事 AI 实践。</p>
          <div className="projects-grid">{projects.map((project, index) => <article className="project-card" key={project.title}><span className="project-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{project.title}</h3><p>{project.detail}</p></article>)}</div>
        </div></section>

        <section className="section container" aria-labelledby="experience-intro">
          <SectionHeading id="experience-intro" marker="履历" title="经历导读" />
          <div className="intro-layout"><div><p className="intro-date">2025.07‑至今</p><h3>京东集团共享服务中心 · 属地HR</h3><p>负责属地员工人事全生命周期运营，统筹社保公积金业务经办；主导推进AI‑Native人力资源体系建设，聚焦人事业务数字化创新。</p></div><a className="text-link intro-link" href="#experience">查看完整经历（6 段）</a></div>
        </section>

        <section className="section container experience-section" aria-labelledby="experience">
          <SectionHeading id="experience" marker="完整记录" title="工作经历" />
          <a className="text-link return-link" href="#top">返回首页简介</a>
          <nav className="experience-nav" aria-label="六段工作经历目录"><ol>{experiences.map((job) => <li key={job.id}><a href={`#${job.id}`}>{job.company}</a></li>)}</ol></nav>
          <div className="experience-list">{experiences.map((job, index) => <article className="experience-item" key={job.id}>
            <div className="experience-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
            <div className="experience-body"><h3 id={job.id} tabIndex={-1}>{job.company}<span className="job-separator">｜</span>{job.position}</h3><p className="job-date">{job.date}</p>
              {job.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {job.points && <ul className="detail-list">{job.points.map((point) => <li key={point}>{point}</li>)}</ul>}
              {job.projects && <div className="experience-projects"><h4>核心项目</h4><ol>{job.projects.map((project) => <li key={project.title}><strong>{project.title}</strong><p>{project.detail}</p></li>)}</ol></div>}
              <a className="text-link return-link" href="#top">返回首页简介</a>
            </div>
          </article>)}</div>
          <a className="text-link next-link" href="#about-more">继续阅读教育与更多</a>
        </section>

        <section className="section more-section" aria-labelledby="about-more"><div className="container">
          <SectionHeading id="about-more" marker="更多" title="教育与更多" />
          <div className="more-grid"><div className="more-main">
            <div className="more-block"><h3>教育背景</h3><p className="education-name">湖南理工大学｜人力资源管理 本科｜2021.09‑2025.06</p><p>系统学习人力资源全链路专业知识，主修人力资源管理概论、人员素质测评、薪酬与绩效管理、员工关系管理、组织行为学、心理学、经济法、统计学等课程。</p><p>在校期间获评优秀学生会干部、优秀共青团员、团校培训优秀学员，在校学生组织与球队担任管理岗位，积累团队管理、活动统筹、跨部门协作经验。</p><p>证书：全国计算机二级、大学英语四级；可阅读英文业务文档，完成基础英文业务沟通。</p></div>
            <div className="more-block"><h3>校园实践</h3><ul className="detail-list">{campus.map((item) => <li key={item.title}><strong>{item.title}：</strong>{item.text}</li>)}</ul></div>
          </div><div className="more-side">
            <div className="more-block"><h3>个人特质</h3><p>兼具传统HR业务深度与AI数字化创新视野，熟悉互联网、制造新能源、零售多行业人力资源痛点；擅长业务流程拆解、需求理解、问题诊断、跨部门协同落地；逻辑缜密，做事严谨细致，抗压能力强，持续学习新技术，既能够处理复杂人事业务，也可以完成AI人事项目从0到1的落地，期待用数字化思维解决真实人力资源业务问题。</p></div>
            <div className="more-block"><h3>兴趣爱好</h3><ul className="detail-list">{interests.map((item) => <li key={item.title}><strong>{item.title}：</strong>{item.text}</li>)}</ul></div>
          </div></div>
        </div></section>

        <section className="section container contact-section" aria-labelledby="contact">
          <SectionHeading id="contact" marker="联系" title="保持联系" />
          <p>欢迎通过电话或邮件联系，也可以访问个人实践项目。</p>
          <div className="contact-grid"><div><h3>电话</h3><a href="tel:18173959893">18173959893</a><p>将调用设备拨号应用</p></div><div><h3>邮箱</h3><a href="mailto:dengyifeng2003@163.com">dengyifeng2003@163.com</a><p>将调用设备邮件应用</p></div><div><h3>个人项目</h3><a href="https://innerquest.online/">InnerQuest · 向内求索（外部网站）</a><p>外部网站，打开后将离开本站</p></div></div>
        </section>
      </main>
      <footer className="site-footer container"><span>邓易丰 Alan</span><a href="#top">返回首页简介</a></footer>
    </>
  )
}

export default App