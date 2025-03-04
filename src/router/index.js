import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import CodingView from '@/views/CodingView.vue';
import SandboxView from '@/views/SandboxView.vue';
import ModdingView from '@/views/ModdingView.vue';
import SocialNewsView from '@/views/SocialNewsView.vue';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'accueil',
            component: HomeView
        },
        {
            path: '/programmation',
            name: 'programmation',
            component: CodingView
        },
        {
            path: '/bac-a-sable',
            name: 'bac-a-sable',
            component: SandboxView
        },
        {
            path: '/modding',
            name: 'modding',
            component: ModdingView
        },
        {
            path: '/actualites',
            name: 'actualites',
            component: SocialNewsView
        }
    ]
});
export default router;
