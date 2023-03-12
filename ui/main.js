import './style.scss';

import qr from 'qrcode';

const $app = document.querySelector('#app');
qr.toString(`${window.location.origin}/index.json`, { margin: 0 }).then((v) => {
  $app.innerHTML =
    // language=html
    `
      <div id="qr"><h1>Oak TB</h1>
        <div class="pa">${v}</div>
      </div>` + $app.innerHTML;
});


fetch('index.json')
  .then((v) => v.json())
  .then((v) => {
    setupApps(v.apps);
    setupDeps(v.deps);
    onResize();
  });

function setupApps(apps) {
  let part = '';
  for (const key in apps) {
    const list = apps[key];
    if (list.length) {
      let app = '';
      for (const it of list) {
        app +=
          // language=html
          `
            <div class="pa app">
              <div>
                <i class="pa" style="background-image: url(${it.icon})"></i>
                <div>
                  <label>${it.name}</label>
                  <span>${it.version}</span>
                </div>
                <a href="${it.homepage}" title="${it.homepage}" target="_blank">>></a>
              </div>
              ${it.description ? `<p>${it.description}` : ''}
            </div>
          `;
      }
      part +=
        // language=html
        `
          <h3><span>>></span> ${key.toUpperCase()}</h3>
          <div class="apps">${app}</div>
        `;
    }
  }
  $app.innerHTML +=
    // language=html
    `
      <div id="apps"><h2>Branches</h2>${part}</div>
    `;
}

function setupDeps(deps) {
  let part = '';
  for (const dep of deps) {
    part +=
      // language=html
      `
        <div class="pa dep">
          <div>
            <label>${dep.name}</label>
            <span>${dep.version}</span>
            <b>${dep.license}</b>
          </div>
          <p>${dep.description}</p>
        </div>
      `;
  }
  $app.innerHTML +=
    // language=html
    `
      <div id="deps">
        <h2>Trunks</h2>
        <div class="deps">${part}</div>
      </div>
    `;
}


function resizeChildren(selector, itemSelector, minWidth, maxWidth) {
  const wrapper = document.querySelector(selector);
  const width = wrapper.clientWidth;
  const items = document.querySelectorAll(itemSelector);
  const gap = 12;

  for (const item of items) {
    item.style.marginBottom = gap + 'px';
    item.style.position = null;
    item.style.width = null;
    item.style.left = null;
    item.style.top = null;
    item.style.top = null;
  }
  wrapper.style.height = null;

  const cols = Math.floor((width + gap) / (minWidth + gap));
  if (cols >= 2) {
    const itemWidth = items.length < cols ?
      Math.min(Math.floor((width + gap) / items.length - gap), maxWidth)
      : Math.floor((width + gap) / cols) - gap;
    const hs = {};
    for (let i = 0; i < cols; i++) {
      const left = i * (itemWidth + gap);
      hs[i] = {
        col: i, left: left ? left : 0, top: 0,
      };
    }
    const minCol = () => {
      let minObj;
      for (const key in hs) {
        const obj = hs[key];
        if (!minObj) {
          minObj = obj;
        } else {
          if (obj.top < minObj.top) {
            minObj = obj;
          }
        }
      }
      return minObj;
    };
    const maxHeight = () => {
      let max = 0;
      for (const key in hs) {
        max = Math.max(max, hs[key].top);
      }
      return max;
    };
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.style.marginBottom = null;
      item.style.position = 'absolute';
      item.style.width = itemWidth + 'px';
      const col = minCol();
      item.style.left = col.left + 'px';
      item.style.top = col.top + 'px';
      col.top += item.offsetHeight + gap;
    }
    const mh = maxHeight();
    if (items.length > cols) {
      wrapper.style.height = mh - gap + 'px';
    } else {
      wrapper.style.height = mh + 'px';
    }
  }
}


let resizeTimer;

function onResize() {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  const willResize = (check) => {
    resizeChildren('.apps', '.app', 200, 320);
    resizeChildren('.deps', '.dep', 240, 320);
    if (!check) {
      resizeTimer = setTimeout(() => willResize(true), 500);
    }
  };
  resizeTimer = setTimeout(willResize, 50);
}


window.addEventListener('resize', onResize);
