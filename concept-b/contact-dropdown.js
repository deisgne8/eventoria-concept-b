(() => {
  const select = document.querySelector('.contact-form select');
  if (!select) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'glass-dropdown';
  select.parentNode.insertBefore(wrapper, select);
  wrapper.append(select);
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'glass-dropdown-trigger';
  const menu = document.createElement('ul');
  menu.className = 'glass-dropdown-menu';
  menu.hidden = true;
  const sync = () => { trigger.textContent = select.options[select.selectedIndex].textContent; };
  [...select.options].forEach(option => {
    const item = document.createElement('li');
    item.className = 'glass-dropdown-option';
    item.textContent = option.textContent;
    item.addEventListener('click', () => {
      if (option.disabled) return;
      select.value = option.value;
      select.dispatchEvent(new Event('change', {bubbles:true}));
      sync();
      menu.hidden = true;
    });
    menu.append(item);
  });
  sync();
  trigger.addEventListener('click', () => { menu.hidden = !menu.hidden; });
  select.hidden = true;
  wrapper.append(trigger, menu);
})();
