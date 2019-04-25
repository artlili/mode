import Vue from 'vue';

export const ClickOutside = {
    bind (el, binding, vnode) {
        el.addEventListener('click', function(event) { event.stopPropagation() })
        document.body.addEventListener('click', binding.value)
    },
    unbind(el, binding) {
        el.removeEventListener('click', function(event) { event.stopPropagation() })
        document.body.removeEventListener('click', binding.value)
    },
}

Vue.directive('click-outside', ClickOutside);