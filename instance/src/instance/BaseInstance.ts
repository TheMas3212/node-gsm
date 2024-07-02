import { readFile, writeFile } from "fs/promises";
import { join } from "path";

type InstanceConfig = any;
type ServerConfig = any;
type CommandResult<T> = Promise<{ success: boolean, result?: T, error?: any }>;

interface Instance {

  // Instance
  getInstanceConfig(): CommandResult<InstanceConfig>;
  setInstanceConfig(config: InstanceConfig): CommandResult<void>;
  reloadInstance(): never;

  // Configuration
  // getServerConfig(): CommandResult<ServerConfig>;
  // setServerConfig(config: ServerConfig): CommandResult<void>;

  // Filesystem
  // readFile(path: string): CommandResult<Buffer>;
  // writeFile(path: string, data: Buffer): CommandResult<void>;
  // readdir(path: string): CommandResult<string[]>;
  // mkdir(path: string): CommandResult<void>;
  // move(from: string, to: string): CommandResult<void>;
  // copy(from: string, to: string): CommandResult<void>;
  // delete(path: string): CommandResult<void>;

  // Running Status
  start(): CommandResult<void>;
  stop(): CommandResult<void>;
  // status(): CommandResult<void>;
  // pause(): CommandResult<void>;
  // createBackup(name: string): CommandResult<void>;
  // restoreBackup(name: string): CommandResult<void>;

  // Common Commands
  // kick(user: string): CommandResult<void>;
  // ban(user: string): CommandResult<void>;
  // whitelist(user: string): CommandResult<void>;
  // dewhitelist(user: string): CommandResult<void>;
  // op(user: string): CommandResult<void>;
  // deop(user: string): CommandResult<void>;
  // unban(user: string): CommandResult<void>;
  // players(): CommandResult<string[]>;
  // say(message: string): CommandResult<void>;
  exec(command: string): CommandResult<string>;
}

export abstract class BaseInstance implements Instance {

  // Instance
  async getInstanceConfig(): CommandResult<InstanceConfig> {
    try {
      const config = JSON.parse(await readFile(join(".", "instance-config.json"), "utf8"));
      return { success: true, result: config };
    } catch (error) {
      return { success: false, error };
    }
  }
  async setInstanceConfig(config: InstanceConfig): CommandResult<void> {
    try {
      await writeFile(join(".", "instance-config.json"), JSON.stringify(config), "utf8");
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
  reloadInstance(): never {
    process.exit(0);
  }

  // Configuration
  // abstract getServerConfig(): CommandResult<any>;
  // abstract setServerConfig(config: any): CommandResult<void>;

  // Filesystem
  // abstract readFile(path: string): CommandResult<Buffer>;
  // abstract writeFile(path: string, data: Buffer): CommandResult<void>;
  // abstract readdir(path: string): CommandResult<string[]>;
  // abstract mkdir(path: string): CommandResult<void>;
  // abstract move(from: string, to: string): CommandResult<void>;
  // abstract copy(from: string, to: string): CommandResult<void>;
  // abstract delete(path: string): CommandResult<void>;

  // Running Status
  abstract start(): CommandResult<void>;
  abstract stop(): CommandResult<void>;
  // abstract status(): CommandResult<void>;
  // abstract pause(): CommandResult<void>;
  // abstract createBackup(name: string): CommandResult<void>;
  // abstract restoreBackup(name: string): CommandResult<void>;

  // Common Commands
  // abstract kick(user: string): CommandResult<void>;
  // abstract ban(user: string): CommandResult<void>;
  // abstract whitelist(user: string): CommandResult<void>;
  // abstract dewhitelist(user: string): CommandResult<void>;
  // abstract op(user: string): CommandResult<void>;
  // abstract deop(user: string): CommandResult<void>;
  // abstract unban(user: string): CommandResult<void>;
  // abstract players(): CommandResult<string[]>;
  // abstract say(message: string): CommandResult<void>;
  abstract exec(command: string): CommandResult<string>;
}