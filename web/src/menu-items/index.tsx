//types
import { NavItemType } from '@/types/menu';

import { AppstoreOutlined, MailOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| MENU ITEMS ||============================== //

const exploreItems: NavItemType = {
  id: 'explore',
  type: 'group',
  children: [
    {
      id: 'explore',
      title: 'Explore',
      type: 'item',
      icon: SearchOutlined,
      url: '/explore',
    },
    {
      id: 'my_applets',
      title: 'My Applets',
      type: 'item',
      icon: AppstoreOutlined,
      url: '/my_applets',
    },
    {
      id: 'faq',
      title: 'FAQ',
      type: 'item',
      icon: QuestionCircleOutlined,
      url: '/faq',
    },
    {
      id: 'contact',
      title: 'Contact',
      type: 'item',
      icon: MailOutlined,
      url: '/about/contact',
    },
  ],
};

const menuItems: { items: NavItemType[] } = {
  items: [exploreItems],
};

export default menuItems;
