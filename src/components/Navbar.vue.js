/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
const isDarkMode = ref(true);
const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle('dark', isDarkMode.value);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "bg-white dark:bg-gray-800 shadow-md" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container mx-auto px-4 py-4 flex justify-between items-center" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "text-2xl font-bold text-bikininjas-primary dark:text-bikininjas-secondary" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "text-2xl font-bold text-bikininjas-primary dark:text-bikininjas-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex space-x-4" },
});
const __VLS_4 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    to: "/programmation",
    ...{ class: "text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary" },
}));
const __VLS_6 = __VLS_5({
    to: "/programmation",
    ...{ class: "text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
const __VLS_8 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    to: "/bac-a-sable",
    ...{ class: "text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary" },
}));
const __VLS_10 = __VLS_9({
    to: "/bac-a-sable",
    ...{ class: "text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
const __VLS_12 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    to: "/modding",
    ...{ class: "text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary" },
}));
const __VLS_14 = __VLS_13({
    to: "/modding",
    ...{ class: "text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
const __VLS_16 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    to: "/actualites",
    ...{ class: "text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary" },
}));
const __VLS_18 = __VLS_17({
    to: "/actualites",
    ...{ class: "text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleDarkMode) },
    ...{ class: "ml-4 text-gray-700 dark:text-gray-300 hover:text-bikininjas-primary dark:hover:text-bikininjas-secondary" },
});
(__VLS_ctx.isDarkMode ? '☀️' : '🌙');
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bikininjas-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-bikininjas-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-bikininjas-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-bikininjas-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-bikininjas-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-bikininjas-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-bikininjas-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-bikininjas-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-bikininjas-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-bikininjas-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-bikininjas-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-bikininjas-secondary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RouterLink: RouterLink,
            isDarkMode: isDarkMode,
            toggleDarkMode: toggleDarkMode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
