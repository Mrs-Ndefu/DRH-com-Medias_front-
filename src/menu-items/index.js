// ==============================|| MENU ITEMS - SIRH ||============================== //

const hr = {
  id: 'group-rh',
  title: 'hr-management',
  type: 'group',
  roles: ['ADMIN', 'DRH', 'SUPER_USER', 'RH', 'CHEF', 'SG'],
  children: [
    {
      id: 'dashboard',
      title: 'dashboard',
      type: 'item',
      url: '/dashboard',
      icon: 'ph ph-squares-four',
      roles: ['ADMIN', 'DRH', 'SUPER_USER', 'RH', 'CHEF', 'SG']
    },
    {
      id: 'agents',
      title: 'agents',
      type: 'collapse',
      icon: 'ph ph-users',
      roles: ['ADMIN', 'DRH', 'RH'],
      children: [
        { id: 'agents-list',   title: 'agents-list',   type: 'item', url: '/agents',        roles: ['ADMIN','DRH','RH'] },
        { id: 'agents-create', title: 'agents-create', type: 'item', url: '/agents/create', roles: ['ADMIN','DRH','RH'] }
      ]
    },
    {
      id: 'leaves',
      title: 'leaves',
      type: 'item',
      url: '/leaves',
      icon: 'ph ph-calendar-check',
      roles: ['ADMIN', 'DRH', 'RH', 'CHEF']
    },
    {
      id: 'attendance',
      title: 'attendance',
      type: 'item',
      url: '/attendance',
      icon: 'ph ph-clock',
      // SUPER_USER a accès total aux présences
      roles: ['ADMIN', 'DRH', 'SUPER_USER', 'RH']
    },
    {
      id: 'organisation',
      title: 'organisation',
      type: 'collapse',
      icon: 'ph ph-tree-structure',
      // SG peut voir la structure (lecture seule)
      roles: ['ADMIN', 'DRH', 'SG', 'RH', 'CHEF'],
      children: [
        { id: 'org-sg',         title: 'org-sg',         type: 'item', url: '/organisation?tab=secretariat', roles: ['ADMIN','DRH','SG','RH','CHEF'] },
        { id: 'org-directions', title: 'org-directions', type: 'item', url: '/organisation',                 roles: ['ADMIN','DRH','SG','RH','CHEF'] },
        { id: 'org-divisions',  title: 'org-divisions',  type: 'item', url: '/organisation?tab=divisions',   roles: ['ADMIN','DRH','SG','RH','CHEF'] },
        { id: 'org-grades',     title: 'org-grades',     type: 'item', url: '/organisation?tab=grades',      roles: ['ADMIN','DRH','SG','RH','CHEF'] },
        { id: 'org-fonctions',  title: 'org-fonctions',  type: 'item', url: '/organisation?tab=fonctions',   roles: ['ADMIN','DRH','SG','RH','CHEF'] }
      ]
    },
    {
      id: 'payroll',
      title: 'payroll',
      type: 'collapse',
      icon: 'ph ph-money',
      // SG peut voir la paie (lecture seule)
      roles: ['ADMIN', 'DRH', 'SG'],
      children: [
        { id: 'pay-apercu',       title: 'pay-apercu',       type: 'item', url: '/payroll',                  roles: ['ADMIN','DRH','SG'] },
        { id: 'pay-bulletins',    title: 'pay-bulletins',    type: 'item', url: '/payroll?tab=bulletins',     roles: ['ADMIN','DRH','SG'] },
        { id: 'pay-elements',     title: 'pay-elements',     type: 'item', url: '/payroll?tab=elements',      roles: ['ADMIN','DRH','SG'] },
        { id: 'pay-virements',    title: 'pay-virements',    type: 'item', url: '/payroll?tab=virements',     roles: ['ADMIN','DRH','SG'] },
        { id: 'pay-declarations', title: 'pay-declarations', type: 'item', url: '/payroll?tab=declarations',  roles: ['ADMIN','DRH','SG'] }
      ]
    },
    {
      id: 'recruitment',
      title: 'recruitment',
      type: 'collapse',
      icon: 'ph ph-briefcase',
      roles: ['ADMIN', 'DRH', 'RH'],
      children: [
        { id: 'rec-offres',      title: 'rec-offres',      type: 'item', url: '/recruitment',                 roles: ['ADMIN','DRH','RH'] },
        { id: 'rec-candidats',   title: 'rec-candidats',   type: 'item', url: '/recruitment?tab=candidats',   roles: ['ADMIN','DRH','RH'] },
        { id: 'rec-entretiens',  title: 'rec-entretiens',  type: 'item', url: '/recruitment?tab=entretiens',  roles: ['ADMIN','DRH','RH'] },
        { id: 'rec-integration', title: 'rec-integration', type: 'item', url: '/recruitment?tab=integration', roles: ['ADMIN','DRH','RH'] }
      ]
    }
  ]
};

const archives = {
  id: 'group-archives',
  title: 'archives',
  type: 'group',
  roles: ['ADMIN', 'DRH', 'SUPER_USER'],
  children: [
    {
      id: 'archives',
      title: 'archives',
      type: 'collapse',
      icon: 'ph ph-archive',
      roles: ['ADMIN', 'DRH', 'SUPER_USER'],
      children: [
        { id: 'arch-agents',    title: 'arch-agents',    type: 'item', url: '/archives',               roles: ['ADMIN','DRH','SUPER_USER'] },
        { id: 'arch-documents', title: 'arch-documents', type: 'item', url: '/archives?tab=documents', roles: ['ADMIN','DRH','SUPER_USER'] }
      ]
    }
  ]
};

const admin = {
  id: 'group-admin',
  title: 'administration',
  type: 'group',
  roles: ['ADMIN'],
  children: [
    {
      id: 'users',
      title: 'users-management',
      type: 'item',
      url: '/admin/users',
      icon: 'ph ph-users-three',
      roles: ['ADMIN']
    }
  ]
};

const menuItems = { items: [hr, archives, admin] };

export default menuItems;
