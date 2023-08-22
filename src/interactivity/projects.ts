import projectsFiles from '../../projects.json';

type Language = 'C++' | 'Typescript' | 'Javascript' | 'C' | 'Java';

interface ProjectData {
  title: string;
  status: 'Private' | 'WIP' | 'Public' | 'Released';
  startDate: string;
  endDate?: string;
  description: string;
  role: string;
  hardSkillsTags: string[];
  softSkillsTags: string[];
  language: Language;
  link?: string;
}

interface ProjectItem {
  data: ProjectData;
  index: number;
  element: HTMLElement;
}

const PROJECTS_DATAS = projectsFiles as ProjectData[];

const LANGUAGE_COLORS: {
  [K in Language]: string;
} = {
  C: '#555555',
  'C++': '#f34b7d',
  Java: '#b07219',
  Javascript: '#f1e05a',
  Typescript: '#3178c6 ',
};

const PROJECTS: ProjectItem[] = [];
const animationData = {
  targetMouseY: 0,
  currentMouseY: 0,
};

const PROJECTS_CONTAINER = document.getElementById('projects-container') as HTMLElement;
const PROJECT_ITEM_TEMPLATE = document.getElementById('project-template') as HTMLElement;

PROJECT_ITEM_TEMPLATE.remove();

function createProjectElement(project: ProjectData) {
  // duplicate template
  const projectElt = PROJECT_ITEM_TEMPLATE.cloneNode(true) as HTMLLinkElement;
  projectElt.removeAttribute('id');
  projectElt.classList.remove('hidden');

  // set title
  const titleElt = projectElt.querySelector('.project-header > a') as HTMLLinkElement;
  titleElt.innerHTML = project.title;
  titleElt.href = project.link ?? '';

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

  const createTag = (parent: HTMLElement, tag: string) => {
    const tagElt = document.createElement('p');
    tagElt.classList.add('project-tag');
    tagElt.innerText = tag;
    parent.appendChild(tagElt);
  };

  // set hard tags
  const hardTagsContainerElt = projectElt.querySelector('.project-hard-tags') as HTMLElement;
  project.hardSkillsTags.forEach(tag => createTag(hardTagsContainerElt, tag));

  // set soft tags
  const softTagsContainerElt = projectElt.querySelector('.project-soft-tags') as HTMLElement;
  project.softSkillsTags.forEach(tag => createTag(softTagsContainerElt, tag));

  // set dates and role
  const dateRoleElt = projectElt.querySelector('.project-footer > p') as HTMLElement;
  dateRoleElt.innerText = `${project.startDate} - ${project.endDate ?? 'now'} • ${project.role}`;

  if (project.link != null) {
    projectElt.onclick = () => {
      window.open(project.link, 'blank_');
    };
  }
  return projectElt;
}

function setProjectItemPosition(item: ProjectItem, mouseY: number) {
  const centeredMouseY = mouseY - window.innerHeight / 2;
  const reducedCenteredMouseY = centeredMouseY * 4;

  const radius = window.innerHeight * 1.3;

  const spreadAngle = Math.PI / 2;

  const initialOffset = -spreadAngle / 2;

  const mouseOffset = -(reducedCenteredMouseY / window.innerHeight) * (spreadAngle / PROJECTS_DATAS.length);

  const offsetAngle = initialOffset + mouseOffset;
  const rotateAngle = (spreadAngle / (PROJECTS_DATAS.length - 1)) * item.index + offsetAngle;

  const x = Math.cos(rotateAngle) * radius - radius;
  const y = Math.sin(rotateAngle) * radius;

  item.element.style.setProperty('--x', `${x}px`);
  item.element.style.setProperty('--y', `${y}px`);
}

function handleMouseMovements() {
  window.addEventListener('mousemove', event => {
    animationData.targetMouseY = event.clientY;
  });
}

function animationLoop() {
  const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

  const animate = () => {
    requestAnimationFrame(animate);

    const { currentMouseY, targetMouseY } = animationData;

    animationData.currentMouseY = lerp(currentMouseY, targetMouseY, 0.1);
    PROJECTS.forEach(project => {
      setProjectItemPosition(project, animationData.currentMouseY);
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
