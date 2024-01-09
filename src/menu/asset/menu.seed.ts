import { MAIN_MENU_ID, PERMISSION_MENU_ID } from '../enum/menu.enum';
import { MenuEntity } from '../menu.entity';

export const MAIN_MENU: MenuEntity[] = [
  {
    id: MAIN_MENU_ID.HOME,
    name: 'Home',
    route: '/home',
  },
  {
    id: MAIN_MENU_ID.STUDENT,
    name: 'Student',
    route: '/student',
  },
  {
    id: MAIN_MENU_ID.TEACHER,
    name: 'Teacher',
    route: '/teacher',
  },
  {
    id: MAIN_MENU_ID.CLASSROOM,
    name: 'Classroom',
    route: '/classroom',
  },
  {
    id: MAIN_MENU_ID.PERMISSION,
    name: 'Permission',
    route: '/permission',
  },
];

export const PERMISSION_MENU: MenuEntity[] = [
  {
    id: PERMISSION_MENU_ID.ROLE,
    name: 'Role',
    route: '/role',
    parentId: MAIN_MENU_ID.PERMISSION,
  },
  {
    id: PERMISSION_MENU_ID.ROLE_MENU,
    name: 'Role menu',
    route: '/role-menu',
    parentId: MAIN_MENU_ID.PERMISSION,
  },
  {
    id: PERMISSION_MENU_ID.USER_ROLE,
    name: 'User role',
    route: '/user-role',
    parentId: MAIN_MENU_ID.PERMISSION,
  },
];
