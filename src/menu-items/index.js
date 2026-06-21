// ==============================|| MENU ITEMS - RH ||============================== //

const hr = {
  id: 'group-rh',
  title: 'hr-management',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'dashboard',
      type: 'item',
      url: '/dashboard',
      icon: 'ph ph-squares-four'
    },
    {
      id: 'agents',
      title: 'agents',
      type: 'collapse',
      icon: 'ph ph-users',
      children: [
        { id: 'agents-list',   title: 'agents-list',   type: 'item', url: '/agents'        },
        { id: 'agents-create', title: 'agents-create', type: 'item', url: '/agents/create' }
      ]
    },
    {
      id: 'leaves',
      title: 'leaves',
      type: 'item',
      url: '/leaves',
      icon: 'ph ph-calendar-check'
    },
    {
      id: 'attendance',
      title: 'attendance',
      type: 'item',
      url: '/attendance',
      icon: 'ph ph-clock'
    },
    {
      id: 'organisation',
      title: 'organisation',
      type: 'collapse',
      icon: 'ph ph-tree-structure',
      children: [
        { id: 'org-sg',         title: 'org-sg',         type: 'item', url: '/organisation?tab=secretariat' },
        { id: 'org-directions', title: 'org-directions', type: 'item', url: '/organisation' },
        { id: 'org-divisions',  title: 'org-divisions',  type: 'item', url: '/organisation?tab=divisions' },
        { id: 'org-grades',     title: 'org-grades',     type: 'item', url: '/organisation?tab=grades' },
        { id: 'org-fonctions',  title: 'org-fonctions',  type: 'item', url: '/organisation?tab=fonctions' }
      ]
    },
    {
      id: 'payroll',
      title: 'payroll',
      type: 'item',
      url: '/payroll',
      icon: 'ph ph-money'
    },
    {
      id: 'recruitment',
      title: 'recruitment',
      type: 'collapse',
      icon: 'ph ph-briefcase',
      children: [
        { id: 'rec-offres',      title: 'rec-offres',      type: 'item', url: '/recruitment'                   },
        { id: 'rec-candidats',   title: 'rec-candidats',   type: 'item', url: '/recruitment?tab=candidats'    },
        { id: 'rec-entretiens',  title: 'rec-entretiens',  type: 'item', url: '/recruitment?tab=entretiens'   },
        { id: 'rec-integration', title: 'rec-integration', type: 'item', url: '/recruitment?tab=integration'  }
      ]
    }
  ]
};

const menuItems = { items: [hr] };

export default menuItems;
