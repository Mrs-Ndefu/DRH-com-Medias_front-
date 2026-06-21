import PropTypes from 'prop-types';
import { createContext, useCallback } from 'react';

// project-imports
import config from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

export const ConfigContext = createContext(config);

export function ConfigProvider({ children }) {
  const [themeConfig, setThemeConfig] = useLocalStorage('datta-config', config);

  const onChangeLocalization = useCallback((lang) => {
    setThemeConfig((prev) => ({ ...prev, i18n: lang }));
  }, [setThemeConfig]);

  const onChangeMode = useCallback((mode) => {
    setThemeConfig((prev) => ({ ...prev, mode }));
  }, [setThemeConfig]);

  const onChangeMenuOrientation = useCallback((menuOrientation) => {
    setThemeConfig((prev) => ({ ...prev, menuOrientation }));
  }, [setThemeConfig]);

  const onChangeContainer = useCallback((container) => {
    setThemeConfig((prev) => ({ ...prev, container }));
  }, [setThemeConfig]);

  const onChangePresetColor = useCallback((presetColor) => {
    setThemeConfig((prev) => ({ ...prev, presetColor }));
  }, [setThemeConfig]);

  const onChangeCaption = useCallback((caption) => {
    setThemeConfig((prev) => ({ ...prev, caption }));
  }, [setThemeConfig]);

  const onChangeSidebarTheme = useCallback((sidebarTheme) => {
    setThemeConfig((prev) => ({ ...prev, sidebarTheme }));
  }, [setThemeConfig]);

  const onChangeThemeDirection = useCallback((themeDirection) => {
    setThemeConfig((prev) => ({ ...prev, themeDirection }));
  }, [setThemeConfig]);

  const onChangeCustomColor = useCallback((customColor) => {
    setThemeConfig((prev) => ({ ...prev, customColor }));
  }, [setThemeConfig]);

  return (
    <ConfigContext.Provider
      value={{
        ...themeConfig,
        onChangeLocalization,
        onChangeMode,
        onChangeMenuOrientation,
        onChangeContainer,
        onChangePresetColor,
        onChangeCaption,
        onChangeSidebarTheme,
        onChangeThemeDirection,
        onChangeCustomColor
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

ConfigProvider.propTypes = { children: PropTypes.node };
