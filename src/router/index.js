import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  // {
  //   path: '/pms',
  //   component: Layout,
  //   redirect: '/pms/product',
  //   name: 'pms',
  //   meta: {title: '商品', icon: 'product'},
  //   children: [{
  //     path: 'product',
  //     name: 'product',
  //     component: () => import('@/views/pms/product/index'),
  //     meta: {title: '商品列表', icon: 'product-list'}
  //   },
  //     {
  //       path: 'addProduct',
  //       name: 'addProduct',
  //       component: () => import('@/views/pms/product/add'),
  //       meta: {title: '添加商品', icon: 'product-add'}
  //     },
  //     {
  //       path: 'updateProduct',
  //       name: 'updateProduct',
  //       component: () => import('@/views/pms/product/update'),
  //       meta: {title: '修改商品', icon: 'product-add'},
  //       hidden: true
  //     },
  //     {
  //       path: 'productCate',
  //       name: 'productCate',
  //       component: () => import('@/views/pms/productCate/index'),
  //       meta: {title: '商品分类', icon: 'product-cate'}
  //     },
  //     {
  //       path: 'addProductCate',
  //       name: 'addProductCate',
  //       component: () => import('@/views/pms/productCate/add'),
  //       meta: {title: '添加商品分类'},
  //       hidden: true
  //     },
  //     {
  //       path: 'updateProductCate',
  //       name: 'updateProductCate',
  //       component: () => import('@/views/pms/productCate/update'),
  //       meta: {title: '修改商品分类'},
  //       hidden: true
  //     },
  //     {
  //       path: 'productAttr',
  //       name: 'productAttr',
  //       component: () => import('@/views/pms/productAttr/index'),
  //       meta: {title: '商品类型', icon: 'product-attr'}
  //     },
  //     {
  //       path: 'productAttrList',
  //       name: 'productAttrList',
  //       component: () => import('@/views/pms/productAttr/productAttrList'),
  //       meta: {title: '商品属性列表'},
  //       hidden: true
  //     },
  //     {
  //       path: 'addProductAttr',
  //       name: 'addProductAttr',
  //       component: () => import('@/views/pms/productAttr/addProductAttr'),
  //       meta: {title: '添加商品属性'},
  //       hidden: true
  //     },
  //     {
  //       path: 'updateProductAttr',
  //       name: 'updateProductAttr',
  //       component: () => import('@/views/pms/productAttr/updateProductAttr'),
  //       meta: {title: '修改商品属性'},
  //       hidden: true
  //     },
  //     {
  //       path: 'brand',
  //       name: 'brand',
  //       component: () => import('@/views/pms/brand/index'),
  //       meta: {title: '品牌管理', icon: 'product-brand'}
  //     },
  //     {
  //       path: 'addBrand',
  //       name: 'addBrand',
  //       component: () => import('@/views/pms/brand/add'),
  //       meta: {title: '添加品牌'},
  //       hidden: true
  //     },
  //     {
  //       path: 'updateBrand',
  //       name: 'updateBrand',
  //       component: () => import('@/views/pms/brand/update'),
  //       meta: {title: '编辑品牌'},
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   path: '/oms',
  //   component: Layout,
  //   redirect: '/oms/order',
  //   name: 'oms',
  //   meta: {title: '订单', icon: 'order'},
  //   children: [
  //     {
  //       path: 'order',
  //       name: 'order',
  //       component: () => import('@/views/oms/order/index'),
  //       meta: {title: '订单列表', icon: 'product-list'}
  //     },
  //     {
  //       path: 'orderDetail',
  //       name: 'orderDetail',
  //       component: () => import('@/views/oms/order/orderDetail'),
  //       meta: {title: '订单详情'},
  //       hidden:true
  //     },
  //     {
  //       path: 'deliverOrderList',
  //       name: 'deliverOrderList',
  //       component: () => import('@/views/oms/order/deliverOrderList'),
  //       meta: {title: '发货列表'},
  //       hidden:true
  //     },
  //     {
  //       path: 'orderSetting',
  //       name: 'orderSetting',
  //       component: () => import('@/views/oms/order/setting'),
  //       meta: {title: '订单设置', icon: 'order-setting'}
  //     },
  //     {
  //       path: 'returnApply',
  //       name: 'returnApply',
  //       component: () => import('@/views/oms/apply/index'),
  //       meta: {title: '退货申请处理', icon: 'order-return'}
  //     },
  //     {
  //       path: 'returnReason',
  //       name: 'returnReason',
  //       component: () => import('@/views/oms/apply/reason'),
  //       meta: {title: '退货原因设置', icon: 'order-return-reason'}
  //     },
  //     {
  //       path: 'returnApplyDetail',
  //       name: 'returnApplyDetail',
  //       component: () => import('@/views/oms/apply/applyDetail'),
  //       meta: {title: '退货原因详情'},
  //       hidden:true
  //     }
  //   ]
  // },
  // {
  //   path:'/sms',
  //   component: Layout,
  //   redirect: '/sms/coupon',
  //   name: 'sms',
  //   meta: {title: '营销', icon: 'sms'},
  //   children: [
  //     {
  //       path: 'flash',
  //       name: 'flash',
  //       component: () => import('@/views/sms/flash/index'),
  //       meta: {title: '秒杀活动列表', icon: 'sms-flash'}
  //     },
  //     {
  //       path: 'flashSession',
  //       name: 'flashSession',
  //       component: () => import('@/views/sms/flash/sessionList'),
  //       meta: {title: '秒杀时间段列表'},
  //       hidden:true
  //     },
  //     {
  //       path: 'selectSession',
  //       name: 'selectSession',
  //       component: () => import('@/views/sms/flash/selectSessionList'),
  //       meta: {title: '秒杀时间段选择'},
  //       hidden:true
  //     },
  //     {
  //       path: 'flashProductRelation',
  //       name: 'flashProductRelation',
  //       component: () => import('@/views/sms/flash/productRelationList'),
  //       meta: {title: '秒杀商品列表'},
  //       hidden:true
  //     },
  //     {
  //       path: 'coupon',
  //       name: 'coupon',
  //       component: () => import('@/views/sms/coupon/index'),
  //       meta: {title: '优惠券列表', icon: 'sms-coupon'}
  //     },
  //     {
  //       path: 'addCoupon',
  //       name: 'addCoupon',
  //       component: () => import('@/views/sms/coupon/add'),
  //       meta: {title: '添加优惠券'},
  //       hidden:true
  //     },
  //     {
  //       path: 'updateCoupon',
  //       name: 'updateCoupon',
  //       component: () => import('@/views/sms/coupon/update'),
  //       meta: {title: '修改优惠券'},
  //       hidden:true
  //     },
  //     {
  //       path: 'couponHistory',
  //       name: 'couponHistory',
  //       component: () => import('@/views/sms/coupon/history'),
  //       meta: {title: '优惠券领取详情'},
  //       hidden:true
  //     },
  //     {
  //       path: 'brand',
  //       name: 'homeBrand',
  //       component: () => import('@/views/sms/brand/index'),
  //       meta: {title: '品牌推荐', icon: 'product-brand'}
  //     },
  //     {
  //       path: 'new',
  //       name: 'homeNew',
  //       component: () => import('@/views/sms/new/index'),
  //       meta: {title: '新品推荐', icon: 'sms-new'}
  //     },
  //     {
  //       path: 'hot',
  //       name: 'homeHot',
  //       component: () => import('@/views/sms/hot/index'),
  //       meta: {title: '人气推荐', icon: 'sms-hot'}
  //     },
  //     {
  //       path: 'subject',
  //       name: 'homeSubject',
  //       component: () => import('@/views/sms/subject/index'),
  //       meta: {title: '专题推荐', icon: 'sms-subject'}
  //     },
  //     {
  //       path: 'advertise',
  //       name: 'homeAdvertise',
  //       component: () => import('@/views/sms/advertise/index'),
  //       meta: {title: '广告列表', icon: 'sms-ad'}
  //     },
  //     {
  //       path: 'addAdvertise',
  //       name: 'addHomeAdvertise',
  //       component: () => import('@/views/sms/advertise/add'),
  //       meta: {title: '添加广告'},
  //       hidden:true
  //     },
  //     {
  //       path: 'updateAdvertise',
  //       name: 'updateHomeAdvertise',
  //       component: () => import('@/views/sms/advertise/update'),
  //       meta: {title: '编辑广告'},
  //       hidden:true
  //     }
  //   ]
  // },
  // {
  //   path:'/ums',
  //   component: Layout,
  //   redirect: '/ums/admin',
  //   name: 'ums',
  //   meta: {title: '权限', icon: 'ums'},
  //   children: [
  //     {
  //       path: 'admin',
  //       name: 'admin',
  //       component: () => import('@/views/ums/admin/index'),
  //       meta: {title: '用户列表', icon: 'ums-admin'}
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       component: () => import('@/views/ums/role/index'),
  //       meta: {title: '角色列表', icon: 'ums-role'}
  //     },
  //     {
  //       path: 'allocMenu',
  //       name: 'allocMenu',
  //       component: () => import('@/views/ums/role/allocMenu'),
  //       meta: {title: '分配菜单'},
  //       hidden: true
  //     },
  //     {
  //       path: 'allocResource',
  //       name: 'allocResource',
  //       component: () => import('@/views/ums/role/allocResource'),
  //       meta: {title: '分配资源'},
  //       hidden: true
  //     },
  //     {
  //       path: 'menu',
  //       name: 'menu',
  //       component: () => import('@/views/ums/menu/index'),
  //       meta: {title: '菜单列表', icon: 'ums-menu'}
  //     },
  //     {
  //       path: 'addMenu',
  //       name: 'addMenu',
  //       component: () => import('@/views/ums/menu/add'),
  //       meta: {title: '添加菜单'},
  //       hidden: true
  //     },
  //     {
  //       path: 'updateMenu',
  //       name: 'updateMenu',
  //       component: () => import('@/views/ums/menu/update'),
  //       meta: {title: '修改菜单'},
  //       hidden: true
  //     },
  //     {
  //       path: 'resource',
  //       name: 'resource',
  //       component: () => import('@/views/ums/resource/index'),
  //       meta: {title: '资源列表', icon: 'ums-resource'}
  //     },
  //     {
  //       path: 'resourceCategory',
  //       name: 'resourceCategory',
  //       component: () => import('@/views/ums/resource/categoryList'),
  //       meta: {title: '资源分类'},
  //       hidden: true
  //     }
  //   ]
  // },
  //订单列表
  {
    path: '/order',
    component: Layout,
    redirect: '/order/order',
    name: 'order',
    meta: { title: '订单列表', icon: 'order' },
    children: [
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/order/order/index'),
        meta: { title: '订单列表', icon: 'product-list' }
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/order/order/orderDetail'),
        meta: { title: '订单详情' },
        hidden: true
      },
      {
        path: 'deliverOrderList',
        name: 'deliverOrderList',
        component: () => import('@/views/order/order/deliverOrderList'),
        meta: { title: '发货列表' },
        hidden: true
      },
      {
        path: 'orderSetting',
        name: 'orderSetting',
        component: () => import('@/views/order/order/setting'),
        meta: { title: '订单设置', icon: 'order-setting' },
        hidden: true
      },
      {
        path: 'reconciliation',
        name: 'reconciliation',
        component: () => import('@/views/order/order/reconciliation'),
        meta: { title: '订单对账', icon: 'order-setting' },
        hidden: true
      },
      {
        path: 'returnApply',
        name: 'returnApply',
        component: () => import('@/views/order/apply/index'),
        meta: { title: '退款申请列表', icon: 'order-return' }
      },
      {
        path: 'returnReason',
        name: 'returnReason',
        component: () => import('@/views/order/apply/reason'),
        meta: { title: '退货原因列表', icon: 'order-return-reason' }
      },
      {
        path: 'returnApplyDetail',
        name: 'returnApplyDetail',
        component: () => import('@/views/order/apply/applyDetail'),
        meta: { title: '退货原因详情' },
        hidden: true
      },
      {
        path: 'evaluate',
        name: 'evaluate',
        component: () => import('@/views/order/evaluate/index'),
        meta: { title: '评价列表', icon: 'order-return' },
      },
      {
        path: 'orderAdd',
        name: 'orderAdd',
        component: () => import('@/views/order/orderAdd/index'),
        meta: { title: '订单导入', icon: 'order-return' },
      }
    ]
  },

  //门店管理
  {
    path: '/storeManagement',
    component: Layout,
    redirect: '/storeManagement/management',
    name: 'storeManagement',
    meta: { title: '门店列表', icon: 'mendian' },
    children: [
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/storeManagement/management/index'),
        meta: { title: '门店列表', icon: 'mendian' }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/storeManagement/management/edit'),
        meta: { title: '修改门店', icon: 'ums-admin' },
        hidden: true
      },
    ]
  },
  //套餐管理
  {
    path: '/packageManagement',
    component: Layout,
    redirect: '/packageManagement/management',
    name: 'packageManagement',
    meta: { title: '套餐管理', icon: 'ums' },
    children: [
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/packageManagement/management/index'),
        meta: { title: '套餐列表', icon: 'taocan' }
      },
      {
        path: 'addManagement',
        name: 'addManagement',
        component: () => import('@/views/packageManagement/management/add'),
        meta: { title: '套餐详情', icon: 'ums-admin' },
        hidden: true
      },
      {
        path: 'parts',
        name: 'parts',
        component: () => import('@/views/packageManagement/parts/index'),
        meta: { title: '配件列表', icon: 'peijianguanli' }
      },
      {
        path: 'service',
        name: 'service',
        component: () => import('@/views/packageManagement/service/index'),
        meta: { title: '服务列表', icon: 'fuwu' }
      },
    ]
  },
  //分类管理
  {
    path: '/classifiedManagement',
    component: Layout,
    redirect: '/classifiedManagement/Management',
    name: 'classifiedManagement',
    meta: { title: '分类管理', icon: 'ums' },
    children: [
      {
        path: 'Management',
        name: 'Management',
        component: () => import('@/views/classifiedManagement/Management/index'),
        meta: { title: '分类管理', icon: 'fenlei' }
      },
      {
        path: 'ManagementMenu',
        name: 'ManagementMenu',
        component: () => import('@/views/classifiedManagement/ManagementMenu/index'),
        meta: { title: '二级分类', icon: 'ums-admin' },
        hidden: true
      },
    ]
  },
  //小程序管理
  {
    path: '/appletManagement',
    component: Layout,
    redirect: '/appletManagement/bannerSet',
    name: 'appletManagement',
    meta: { title: '小程序管理', icon: 'xiaochengxu' },
    children: [
      {
        path: 'appletManagement',
        name: 'appletManagement',
        component: () => import('@/views/appletManagement/bannerSet/index'),
        meta: { title: '小程序设置', icon: 'xiaochengxu' }
      },
    ]
  },
  //积分管理
  {
    path: '/integralManage',
    component: Layout,
    redirect: '/oms/integralManage',
    name: 'integralManage',
    meta: { title: '积分管理', icon: 'weibiaoti2fuzhi01' },
    children: [
      {
        path: 'integralManage',
        name: 'integralManage',
        // component: () => import('@/views/oms/integralManage/index'),
        meta: { title: '积分管理', icon: 'weibiaoti2fuzhi01' }
      },
    ]
  },
  //客户管理
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/customerList',
    name: 'customer',
    meta: { title: '客户列表', icon: 'ums' },
    children: [
      {
        path: 'customerList',
        name: 'customerList',
        component: () => import('@/views/customer/customerList/index'),
        meta: { title: '客户列表', icon: 'ums-admin' }
      },
    ]
  },

  //系统设置
  {
    path: '/systemSettings',
    component: Layout,
    redirect: '/systemSettings/user',
    name: 'systemSettings',
    meta: { title: '系统设置', icon: 'xitong' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/systemSettings/user/index'),
        meta: { title: '用户管理', icon: 'iconkh1' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/systemSettings/role/index'),
        meta: { title: '角色管理', icon: 'jiaoseguanli' }
      },
      {
        path: 'jurisdiction',
        name: 'jurisdiction',
        component: () => import('@/views/systemSettings/jurisdiction/index'),
        meta: { title: '权限管理', icon: 'quanxianguanli' }
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRouterMap = [
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    name: 'pms',
    meta: { title: '商品', icon: 'product' },
    children: [{
      path: 'product',
      name: 'product',
      component: () => import('@/views/pms/product/index'),
      meta: { title: '商品列表', icon: 'product-list' }
    },
    {
      path: 'addProduct',
      name: 'addProduct',
      component: () => import('@/views/pms/product/add'),
      meta: { title: '添加商品', icon: 'product-add' }
    },
    {
      path: 'updateProduct',
      name: 'updateProduct',
      component: () => import('@/views/pms/product/update'),
      meta: { title: '修改商品', icon: 'product-add' },
      hidden: true
    },
    {
      path: 'productCate',
      name: 'productCate',
      component: () => import('@/views/pms/productCate/index'),
      meta: { title: '商品分类', icon: 'product-cate' }
    },
    {
      path: 'addProductCate',
      name: 'addProductCate',
      component: () => import('@/views/pms/productCate/add'),
      meta: { title: '添加商品分类' },
      hidden: true
    },
    {
      path: 'updateProductCate',
      name: 'updateProductCate',
      component: () => import('@/views/pms/productCate/update'),
      meta: { title: '修改商品分类' },
      hidden: true
    },
    {
      path: 'productAttr',
      name: 'productAttr',
      component: () => import('@/views/pms/productAttr/index'),
      meta: { title: '商品类型', icon: 'product-attr' }
    },
    {
      path: 'productAttrList',
      name: 'productAttrList',
      component: () => import('@/views/pms/productAttr/productAttrList'),
      meta: { title: '商品属性列表' },
      hidden: true
    },
    {
      path: 'addProductAttr',
      name: 'addProductAttr',
      component: () => import('@/views/pms/productAttr/addProductAttr'),
      meta: { title: '添加商品属性' },
      hidden: true
    },
    {
      path: 'updateProductAttr',
      name: 'updateProductAttr',
      component: () => import('@/views/pms/productAttr/updateProductAttr'),
      meta: { title: '修改商品属性' },
      hidden: true
    },
    {
      path: 'brand',
      name: 'brand',
      component: () => import('@/views/pms/brand/index'),
      meta: { title: '品牌管理', icon: 'product-brand' }
    },
    {
      path: 'addBrand',
      name: 'addBrand',
      component: () => import('@/views/pms/brand/add'),
      meta: { title: '添加品牌' },
      hidden: true
    },
    {
      path: 'updateBrand',
      name: 'updateBrand',
      component: () => import('@/views/pms/brand/update'),
      meta: { title: '编辑品牌' },
      hidden: true
    }
    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    meta: { title: '订单', icon: 'order' },
    children: [
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/oms/order/index'),
        meta: { title: '订单列表', icon: 'product-list' }
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/oms/order/orderDetail'),
        meta: { title: '订单详情' },
        hidden: true
      },
      {
        path: 'deliverOrderList',
        name: 'deliverOrderList',
        component: () => import('@/views/oms/order/deliverOrderList'),
        meta: { title: '发货列表' },
        hidden: true
      },
      {
        path: 'orderSetting',
        name: 'orderSetting',
        component: () => import('@/views/oms/order/setting'),
        meta: { title: '订单设置', icon: 'order-setting' }
      },
      {
        path: 'returnApply',
        name: 'returnApply',
        component: () => import('@/views/oms/apply/index'),
        meta: { title: '退货申请处理', icon: 'order-return' }
      },
      {
        path: 'returnReason',
        name: 'returnReason',
        component: () => import('@/views/oms/apply/reason'),
        meta: { title: '退货原因设置', icon: 'order-return-reason' }
      },
      {
        path: 'returnApplyDetail',
        name: 'returnApplyDetail',
        component: () => import('@/views/oms/apply/applyDetail'),
        meta: { title: '退货原因详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/sms',
    component: Layout,
    redirect: '/sms/coupon',
    name: 'sms',
    meta: { title: '营销', icon: 'sms' },
    children: [
      {
        path: 'flash',
        name: 'flash',
        component: () => import('@/views/sms/flash/index'),
        meta: { title: '秒杀活动列表', icon: 'sms-flash' }
      },
      {
        path: 'flashSession',
        name: 'flashSession',
        component: () => import('@/views/sms/flash/sessionList'),
        meta: { title: '秒杀时间段列表' },
        hidden: true
      },
      {
        path: 'selectSession',
        name: 'selectSession',
        component: () => import('@/views/sms/flash/selectSessionList'),
        meta: { title: '秒杀时间段选择' },
        hidden: true
      },
      {
        path: 'flashProductRelation',
        name: 'flashProductRelation',
        component: () => import('@/views/sms/flash/productRelationList'),
        meta: { title: '秒杀商品列表' },
        hidden: true
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/views/sms/coupon/index'),
        meta: { title: '优惠券列表', icon: 'sms-coupon' }
      },
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('@/views/sms/coupon/add'),
        meta: { title: '添加优惠券' },
        hidden: true
      },
      {
        path: 'updateCoupon',
        name: 'updateCoupon',
        component: () => import('@/views/sms/coupon/update'),
        meta: { title: '修改优惠券' },
        hidden: true
      },
      {
        path: 'couponHistory',
        name: 'couponHistory',
        component: () => import('@/views/sms/coupon/history'),
        meta: { title: '优惠券领取详情' },
        hidden: true
      },
      {
        path: 'brand',
        name: 'homeBrand',
        component: () => import('@/views/sms/brand/index'),
        meta: { title: '品牌推荐', icon: 'product-brand' }
      },
      {
        path: 'new',
        name: 'homeNew',
        component: () => import('@/views/sms/new/index'),
        meta: { title: '新品推荐', icon: 'sms-new' }
      },
      {
        path: 'hot',
        name: 'homeHot',
        component: () => import('@/views/sms/hot/index'),
        meta: { title: '人气推荐', icon: 'sms-hot' }
      },
      {
        path: 'subject',
        name: 'homeSubject',
        component: () => import('@/views/sms/subject/index'),
        meta: { title: '专题推荐', icon: 'sms-subject' }
      },
      {
        path: 'advertise',
        name: 'homeAdvertise',
        component: () => import('@/views/sms/advertise/index'),
        meta: { title: '广告列表', icon: 'sms-ad' }
      },
      {
        path: 'addAdvertise',
        name: 'addHomeAdvertise',
        component: () => import('@/views/sms/advertise/add'),
        meta: { title: '添加广告' },
        hidden: true
      },
      {
        path: 'updateAdvertise',
        name: 'updateHomeAdvertise',
        component: () => import('@/views/sms/advertise/update'),
        meta: { title: '编辑广告' },
        hidden: true
      }
    ]
  },
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: { title: '权限', icon: 'ums' },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin/index'),
        meta: { title: '用户列表', icon: 'ums-admin' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index'),
        meta: { title: '角色列表', icon: 'ums-role' }
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu'),
        meta: { title: '分配菜单' },
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/ums/role/allocResource'),
        meta: { title: '分配资源' },
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/ums/menu/index'),
        meta: { title: '菜单列表', icon: 'ums-menu' }
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/ums/menu/add'),
        meta: { title: '添加菜单' },
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/ums/menu/update'),
        meta: { title: '修改菜单' },
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/ums/resource/index'),
        meta: { title: '资源列表', icon: 'ums-resource' }
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/ums/resource/categoryList'),
        meta: { title: '资源分类' },
        hidden: true
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

