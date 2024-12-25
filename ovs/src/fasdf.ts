import OvsAPI from 'ovsjs/src/OvsAPI';
export const hello = {
  render:function render(){
    return (function(){
      return OvsAPI.createVNode('div',[123789,123789,]);
    })();
  },
};

