function _findParentModalEntry(vm) {
    if (!vm) {
        return false;
    }

    let entry = vm.$parent;
    while (entry && entry.$options.name !== "ModalEntry") {
        entry = entry.$parent;
    }

    return entry;
}

const VueWindowedModal = {
    install(Vue) {
        Vue.mixin({
            created() {
                const self = this;
                this.$modal = {
                    close(data) {
                        const entry = _findParentModalEntry(self);

                        if (entry) {
                            entry.closeCb(data);
                        }
                    }
                };
            }
        });

        Vue.prototype.$showWindowedModal = function(component, options) {
            const defaultOptions = {
                fullscreen: false,
                animated: true,
                stretched: false,
                dimAmount: 0.5,
                ios: {}
            };
            // build options object with defaults
            options = { ...defaultOptions, ...options };

            return new Promise((resolve) => {
                let resolved = false;
                const closeCb = (data) => {
                    if (resolved) { return; }

                    resolved = true;
                    resolve(data);
                    modalPage.closeModal();

                    // emitted to show up in devtools
                    // for debugging purposes
                    navEntryInstance.$emit("modal:close", data);
                    navEntryInstance.$destroy();
                };

                const navEntryInstance = new Vue({
                    name: "ModalEntry",
                    parent: this.$root,
                    methods: { closeCb },
                    render: (h) => h(component, { props: options.props })
                });
                const modalPage = navEntryInstance.$mount().$el.nativeView;
                this.$el.nativeView.showModal(modalPage, {
                    context: null,
                    closeCallback: closeCb,
                    fullscreen: options.fullscreen,
                    animated: options.animated,
                    stretched: options.stretched,
                    dimAmount: options.dimAmount,
                    ios: options.ios,
                    windowedModal: true
                });
            });
        };
    }
};

export default VueWindowedModal;
