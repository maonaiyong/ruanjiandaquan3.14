// 横向滚动控制
const initScroll = () => {
  try {
    // 同时选择AE和PS插件容器
    const pluginGrid = document.querySelector('.plugin-grid, .ps-plugin-grid');
    if (!pluginGrid) return;


    // 触摸滑动
    let touchStartX = 0;
    pluginGrid.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });

    pluginGrid.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touchDelta = touchStartX - e.touches[0].clientX;
      pluginGrid.scrollLeft += touchDelta * 2;
      touchStartX = e.touches[0].clientX;
    });

    // 边界弹性效果
    let isScrolling = false;
    pluginGrid.addEventListener('scroll', () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          const maxScroll = pluginGrid.scrollWidth - pluginGrid.clientWidth;
          
          if (pluginGrid.scrollLeft < 0) {
            pluginGrid.scrollLeft = 0;
          } else if (pluginGrid.scrollLeft > maxScroll) {
            pluginGrid.scrollLeft = maxScroll;
          }
          isScrolling = false;
        });
      }
      isScrolling = true;
    });

    // 箭头按钮控制
    const scrollStep = 300;
    const leftArrow = document.createElement('div');
    const rightArrow = document.createElement('div');
    
    // 创建箭头元素
    leftArrow.className = 'scroll-arrow left-arrow';
    rightArrow.className = 'scroll-arrow right-arrow';
    document.body.appendChild(leftArrow);
    document.body.appendChild(rightArrow);

    // 窗口resize时重新定位
    const positionArrows = () => {
      const rect = pluginGrid.getBoundingClientRect();
      leftArrow.style.top = `${rect.top + rect.height/2}px`;
      rightArrow.style.top = `${rect.top + rect.height/2}px`;
      leftArrow.style.left = `${rect.left - 60}px`;
      rightArrow.style.left = `${rect.right + 20}px`;
    };

    // 更新箭头可见性
    const updateArrowVisibility = () => {
      const scrollLeft = pluginGrid.scrollLeft;
      const maxScroll = pluginGrid.scrollWidth - pluginGrid.clientWidth;
      
      leftArrow.classList.toggle('disabled', scrollLeft <= 0);
      rightArrow.classList.toggle('disabled', scrollLeft >= maxScroll - 1);
    };

    // 初始化事件监听
    pluginGrid.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', () => {
      positionArrows();
      updateArrowVisibility();
    });
    positionArrows();
    updateArrowVisibility();

    // 箭头点击事件
    leftArrow.addEventListener('click', () => {
      pluginGrid.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
    rightArrow.addEventListener('click', () => {
      pluginGrid.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });

    // 光效交互
    const pluginItems = document.querySelectorAll('.plugin-item');
    pluginItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        item.style.setProperty('--mouse-x', `${x}px`);
        item.style.setProperty('--mouse-y', `${y}px`);
      });

      item.addEventListener('mouseleave', () => {
        item.style.removeProperty('--mouse-x');
        item.style.removeProperty('--mouse-y');
      });
    });

  } catch (error) {
    console.error('Scroll initialization error:', error);
  }
};

// 初始化（兼容多容器）
document.addEventListener('DOMContentLoaded', () => {
  // 初始化所有插件容器
  const pluginContainers = document.querySelectorAll('.plugin-grid, .ps-plugin-grid');
  pluginContainers.forEach(container => {
    if (!container.dataset.scrollInitialized) {
      initScroll();
      container.dataset.scrollInitialized = true;
    }
  });
});
