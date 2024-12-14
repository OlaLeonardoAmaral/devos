
import { menuItemsTest, pathsTest } from './pathConfigTest';
import { menuItems, paths } from './pathConfig'; 

const isTestEnvironment = (): boolean => {
    return true;
};

export const menu = isTestEnvironment() ? menuItemsTest : menuItems;
export const pastas = isTestEnvironment() ? pathsTest : paths;