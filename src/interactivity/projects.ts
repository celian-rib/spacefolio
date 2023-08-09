interface ProjectData {
  title: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  technologies?: string[];
}

interface ProjectItem {
  data: ProjectData;
  index: number;
  element: HTMLElement;
}

const PROJECTS_DATAS: ProjectData[] = [
  {
    title: ' as My Project',
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 0, 1),
    description: 'My project description',
    technologies: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Kubernetes', 'AWS'],
  },
  {
    title: ' as My Project',
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 0, 1),
    description: 'My project description',
    technologies: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Kubernetes', 'AWS'],
  },
  {
    title: ' as My Project',
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 0, 1),
    description: 'My project description',
    technologies: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Kubernetes', 'AWS'],
  },
  {
    title: ' as My Project',
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 0, 1),
    description: 'My project description',
    technologies: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Kubernetes', 'AWS'],
  },
  {
    title: ' as My Project',
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 0, 1),
    description: 'My project description',
    technologies: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Kubernetes', 'AWS'],
  },
  {
    title: ' as My Project',
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 0, 1),
    description: 'My project description',
    technologies: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Kubernetes', 'AWS'],
  },
];

const PROJECTS: ProjectItem[] = [];
const animationData = {
  targetMouseX: 0,
  currentMouseX: 0,
};

const PROJECTS_CONTAINER = document.getElementById('projects-container') as HTMLElement;

function createProjectElement(project: ProjectData) {
  const projectElt = document.createElement('div');
  projectElt.classList.add('project');
  projectElt.classList.add('glassy-background');
  projectElt.innerHTML = `
    <p>WIP</p> 
  `;
  return projectElt;
}

function setProjectItemPosition(item: ProjectItem, mouseX: number) {
  const centeredMouseX = mouseX - window.innerWidth / 2;
  const reducedCenteredMouseX = centeredMouseX * 2;

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
