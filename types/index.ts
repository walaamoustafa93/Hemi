/* eslint-disable @typescript-eslint/no-explicit-any */
export type Devices = {
  id: string;
  enabled: boolean;
  name: string;
  type: string;
  description?: string;
  property: {
    address: string;
    method: string;
    format: string;
    ip: string;
    port: number;
    host: number;
    SQLAlchemyURL: string;
    slot: number;
    rack: number;
    username: string;
    password: string;
    DSN: string;
    databaseType: string;
  };
  polling: number;
  lastConnected: string;
};
export type SelectType = {
  id: number;
  title: string;
  value: string;
};

export type SelectPolling = {
  id: number;
  title: string;
  value: number;
};

export type Dashboard = {
  id: string;
  name: string;
  description: string | null;
  projectId: string;
  width: number;
  height: number;
  size: string;
  backgroundColor: string;
  margin: number;
  align: string;
  gridType: string;
  type: string;
  variables: any | null;
  createdAt: string;
  updatedAt: string;
};
export type SelectGridType = {
  id: number;
  title: string;
  value: number;
};

export type databaseType = {
  property: {
    databaseType: string;
    host: number;
    port: number;
    DSN: string;
    username: string;
    password: string;
  };
};

export type Group = {
  id: string;
  name: string;
};

export type Projects = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  // alarms: any[];
  devices: Devices[];
  // reports: any[];
  // scripts: any[];
  // texts: any[];
  // events: any[];
  dashboards: Dashboard[];
};

export type UpdateProjectPayload = {
  data: {
    name: string;
    description: string;
  };
};

export type S7 = {
  property: {
    slot: number;
    port: number;
    ip: string;
    rack: number;
  };
};

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  status: string;
  info: string | null;
  password: string;
  createdAt: string;
  updatedAt: string;
  groups: Group[];
};

export type SelectUserForm = {
  id: number;
  title: string;
  value: string;
};

export type WebAPI = {
  property: {
    method: string;
    format: string;
    address: string;
  };
};
