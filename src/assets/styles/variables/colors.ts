interface ColorShade {
  light: string;
  main: string;
  dark: string;
}

interface TextShade {
  little: string;
  medium: string;
  very: string;
}

interface Colors {
  bgColor: string;
  primary: ColorShade;
  secondary: ColorShade;
  auxiliar: {
    info: string;
    success: string;
    warning: string;
    danger: string;
  };
  text: {
    dark: TextShade;
    light: TextShade;
  };
}

const colors: Colors = {
  bgColor: '#110f10',

  primary: {
    light: '',
    main: '',
    dark: '',
  },

  secondary: {
    light: '',
    main: '',
    dark: '',
  },

  auxiliar: {
    info: '',
    success: '',
    warning: '',
    danger: '',
  },

  text: {
    dark: {
      little: '#666',
      medium: '#333',
      very: '#111',
    },
    light: {
      little: '#aaa',
      medium: '#ccc',
      very: '#fff',
    },
  },
};

export default colors;
