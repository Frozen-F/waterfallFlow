export const getELStyle = el => {
    const res = { width: 0, height: 0 };
    if (el.value) {
      Object.assign(res, {
        width: el.value['offsetWidth'],
        height: el.value['offsetHeight']
      });
    }
    return res;
  };
  