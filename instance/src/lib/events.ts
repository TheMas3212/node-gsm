
export namespace MasterToInstace {
  export const EventType = {
    UpdateKey: "UpdateKey",
    Authorized: "Authorized",
    StartServer: "StartServer",
    StopServer: "StopServer",
    RunCommand: "RunCommand"
  } as const;
  
  export type UpdateKey = {
    type: typeof EventType.UpdateKey;
    key: string;
  };

  export type Authorized = {
    type: typeof EventType.Authorized;
  };

  export type StartServer = {
    type: typeof EventType.StartServer;
    nonce: number;
  };

  export type StopServer = {
    type: typeof EventType.StopServer;
    nonce: number;
  };

  export type RunCommand = {
    type: typeof EventType.RunCommand;
    nonce: number;
    command: string;
  };
}

export namespace InstanceToMaster {
  export const EventType = {
    Authorize: "Authorize",
    Response: "Response",
    LogItem: "LogItem"
  } as const;

  export type Response<T> = {
    type: typeof EventType.Response;
    nonce: number;
    data: T;
  };

  export type LogItem = {
    type: typeof EventType.LogItem;
    data: string;
  };
}

export type StartServerHandler = (event: MasterToInstace.StartServer) => string;
export type StopServerHandler = (event: MasterToInstace.StopServer) => string;
export type RunCommandHandler = (event: MasterToInstace.RunCommand) => string;

export type LogItemHandler = (event: InstanceToMaster.LogItem) => void;