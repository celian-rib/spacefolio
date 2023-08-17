type Language = 'C++' | 'Typescript' | 'Javascript' | 'C' | 'Java';

interface ProjectData {
  title: string;
  status: 'Private' | 'WIP' | 'Public' | 'Released';
  startDate: string;
  endDate?: string;
  description: string;
  role: string;
  tags: string[];
  language: Language;
}

interface ProjectItem {
  data: ProjectData;
  index: number;
  element: HTMLElement;
}

const LANGUAGE_COLORS: {
  [K in Language]: string;
} = {
  C: '#555555',
  'C++': '#f34b7d',
  Java: '#b07219',
  Javascript: '#f1e05a',
  Typescript: '#3178c6 ',
};

const PROJECTS_DATAS: ProjectData[] = [
  {
    title: 'silant-app',
    status: 'Released',
    language: 'Typescript',
    startDate: 'December 2019',
    endDate: 'July 2021',
    description: 'Silant is mobile application that let everyone control the music played in a party.',
    role: 'Co-founder & Mobile developer',
    tags: ['React Native', 'Design', 'Marketing'],
  },
  {
    title: 'spider-web-server',
    status: 'Private',
    language: 'C++',
    startDate: 'May 2023',
    endDate: 'July 2023',
    description: 'HTTP 1.1 Static file with Nginx like feature such as Reverse Proxy and Load Balancer.',
    role: 'Lead software designer & Developer',
    tags: ['Boost.Asio', 'Cmake', 'SSL / TLS'],
  },
  {
    title: '42-sh',
    status: 'Private',
    language: 'C',
    startDate: 'January 2023',
    endDate: 'February 2023',
    description: 'POSIX compliant bash like shell language, it can interpret execute large bash scripts with all expected IO.',
    role: 'Developer',
    tags: ['Bash / POSIX', 'Memory Leaks', 'Lexer', 'Parser'],
  },
  {
    title: 'tiger-lang',
    status: 'Private',
    language: 'C++',
    startDate: 'March 2023',
    endDate: 'June 2023',
    description: 'Tiger is a language made with C++, is has C like control flow and uses LLVM as compiling backend.',
    role: 'Developer',
    tags: ['Lexer', 'Parser', 'Binder', 'Type check', 'LLVM'],
  },
  {
    title: 'hypnoledge-app',
    status: 'Released',
    language: 'Javascript',
    startDate: 'May 2022',
    endDate: 'July 2022',
    description: 'I worked on Hypnoledge during a mobile app development internship over the course of two months.',
    role: 'Lead Developer',
    tags: ['React Native', 'Animated'],
  },
  {
    title: 'upthumb.io',
    status: 'Released',
    language: 'Typescript',
    startDate: 'May 2023',
    endDate: 'July 2023',
    description: 'SaaS product that let YouTube content creators find the right thumbnail for their videos using automation.',
    role: 'Founder & Developer',
    tags: ['Next.js', 'Docker', 'Stripe'],
  },
];

const PROJECTS: ProjectItem[] = [];
const animationData = {
  targetMouseX: 0,
  currentMouseX: 0,
};

const PROJECTS_CONTAINER = document.getElementById('projects-container') as HTMLElement;
const PROJECT_ITEM_TEMPLATE = document.getElementById('project-template') as HTMLElement;

PROJECT_ITEM_TEMPLATE.remove();

function createProjectElement(project: ProjectData) {
  // duplicate template
  const projectElt = PROJECT_ITEM_TEMPLATE.cloneNode(true) as HTMLElement;
  projectElt.removeAttribute('id');
  projectElt.classList.remove('hidden');

  // set title
  const titleElt = projectElt.querySelector('.project-header > a') as HTMLElement;
  titleElt.textContent = project.title;

  // TODO set link

  // set status
  const statusElt = projectElt.querySelector('.project-header > p') as HTMLElement;
  statusElt.textContent = project.status;

  // set description
  const descriptionElt = projectElt.querySelector('.project-main-content > p') as HTMLElement;
  descriptionElt.textContent = project.description;

  // set lang color
  const langColorElt = projectElt.querySelector('.project-language > div') as HTMLElement;
  langColorElt.style.backgroundColor = LANGUAGE_COLORS[project.language];

  // set language
  const languageElt = projectElt.querySelector('.project-language > p') as HTMLElement;
  languageElt.textContent = project.language;

  // set tags
  const tagsContainerElt = projectElt.querySelector('.project-tags') as HTMLElement;
  project.tags.forEach(tag => {
    const tagElt = document.createElement('p');
    tagElt.classList.add('project-tag');
    tagElt.innerText = tag;
    tagsContainerElt.appendChild(tagElt);
  });

  // set dates and role
  const dateRoleElt = projectElt.querySelector('.project-footer > p') as HTMLElement;
  dateRoleElt.innerText = `${project.startDate} - ${project.endDate ?? 'now'} • ${project.role}`;

  return projectElt;
}

function setProjectItemPosition(item: ProjectItem, mouseX: number) {
  const centeredMouseX = mouseX - window.innerWidth / 2;
  const reducedCenteredMouseX = centeredMouseX * 3;

  const radius = window.innerWidth * 2;

  const spreadAngle = Math.PI / 3;

  const initialOffset = Math.PI;

  const mouseOffset = -(reducedCenteredMouseX / window.innerWidth) * (spreadAngle / PROJECTS_DATAS.length);

  const offsetAngle = initialOffset + mouseOffset;
  const rotateAngle = spreadAngle + (spreadAngle / (PROJECTS_DATAS.length - 1)) * item.index + offsetAngle;

  const x = Math.cos(rotateAngle) * radius;
  const y = Math.sin(rotateAngle) * radius + radius;

  item.element.style.setProperty('--x', `${x}px`);
  item.element.style.setProperty('--y', `${y}px`);
}

function handleMouseMovements() {
  window.addEventListener('mousemove', event => {
    animationData.targetMouseX = event.clientX;
  });
}

function animationLoop() {
  const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

  const animate = () => {
    requestAnimationFrame(animate);

    const { currentMouseX, targetMouseX } = animationData;

    animationData.currentMouseX = lerp(currentMouseX, targetMouseX, 0.1);
    PROJECTS.forEach(project => {
      setProjectItemPosition(project, animationData.currentMouseX);
    });
  };

  requestAnimationFrame(animate);
}

export default function initializeProjects() {
  PROJECTS_DATAS.forEach((project, index) => {
    const projectElt = createProjectElement(project);
    PROJECTS_CONTAINER.appendChild(projectElt);

    PROJECTS.push({
      data: project,
      element: projectElt,
      index,
    });
  });

  handleMouseMovements();
  animationLoop();
}
