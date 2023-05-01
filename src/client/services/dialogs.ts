import { defineAsyncComponent, render, createVNode } from 'vue';
import CourseDetail from '../components/CourseDetail.vue'


function installDialog(dialog:){

}

function installDialogs(){
  if (!this.vnode) {
    const dialog = createVNode(this.component, this.props);
    const container = document.createElement('div');
    render(dialog, container);

    this.vnode = dialog;
    this.node = container.childNodes[0];
    document.body.appendChild(this.node);
  }
}


class PasswordDialog {
  constructor() {
    this.component = defineAsyncComponent(
      () => import("@/components/Dialog/password.vue"));
    this.vnode = null;
    this.node = null;
    this.props = {
      width: "30%",
      height: "auto",
    };
  }
  install() {
    if (!this.vnode) {
      const dialog = createVNode(this.component, this.props);
      const container = document.createElement('div');
      render(dialog, container);

      this.vnode = dialog;
      this.node = container.childNodes[0];
      document.body.appendChild(this.node);
    }
  }
  /**
   * 
   * @param {string} title 
   * @returns {Promise<string>}
   */
  show(title) {
    // 发送信号，显示窗口
    const event = new CustomEvent('password-dialog-show', {
      detail:
        { show: true, title: title }
    });
    document.dispatchEvent(event);

    return new Promise((resolve) => {
      document.addEventListener('password-dialog-confirm', event => {
        const password = event.detail.password;
        resolve(password);
      });
    })
  }
}

const passwordDialog = new PasswordDialog();

/**
 * 展示一个阻塞式对话框
 * @param {string} title 
 * @returns {Promise<string>}
 */
export async function showPasswordDialog(title) {
  return passwordDialog.show(title);
}