const API_BASE_URL = 'https://medisupply-backend.duckdns.org/venta/auth';

export interface ServiceVersion {
  name: string;
  version: string;
}

export interface VersionInfo {
  platform: string;
  productVersion: string;
  buildDate: string;
  gitCommit: string;
  web: {
    version: string;
  };
  mobile: {
    ventas: string;
    clientes: string;
  };
  services: ServiceVersion[];
  infrastructure: {
    cloud: string;
    region: string;
    orchestration: string;
    database: string;
  };
}

export const versionService = {
  /**
   * Obtiene la información de versiones del sistema
   */
  async obtenerVersionSistema(): Promise<VersionInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/system/version`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener versión: ${response.status}`);
      }

      const data: VersionInfo = await response.json();
      return data;
    } catch (error) {
      console.error('Error en obtenerVersionSistema:', error);
      throw error;
    }
  },
};
