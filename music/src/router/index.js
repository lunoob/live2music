import Vue from 'vue';
import VueRouter from 'vue-router';
import recommend from 'views/recommend/recommend';
import rank from 'views/rank/rank';
import singer from 'views/singer/singer';
import search from 'views/search/search';
// import singerDetail from 'views/singer/singer-detail/singer-detail';
// import recommendDetail from 'views/recommend/recommend-detail/recommend-detail';
// import rankDetail from 'views/rank/rank-detail/rank-detail';
// import UserCenter from 'views/UserCenter/UserCenter';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: recommend,
    children: [
      {
        path: ':id',
        component: () =>
          import('views/recommend/recommend-detail/recommend-detail')
      }
    ]
  },
  {
    path: '/rank',
    component: rank,
    children: [
      {
        path: ':id',
        component: () => import('views/rank/rank-detail/rank-detail')
      }
    ]
  },
  {
    path: '/singer',
    component: singer,
    children: [
      {
        path: ':id',
        component: () => import('views/singer/singer-detail/singer-detail')
      }
    ]
  },
  {
    path: '/search',
    component: search
  },
  {
    path: '/user',
    component: () => import('views/UserCenter/UserCenter')
  }
];

const router = new VueRouter({
  routes
});

export default router;
