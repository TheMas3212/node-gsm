import { readFileSync, writeFileSync } from "fs";
import { EventBus } from "./EventBus";

type InstanceConfig = {
  eventbus: {
    name: string;
    master_uri: string;
    key: string;
  }
};

function fatalError(error: any): never {
  console.error("Fatal Error");
  console.error(error);
  process.exit(1);
}

class Runner {
  eventbus: EventBus;
  config: InstanceConfig;
  constructor(readonly configpath: string) {
    this.config = this.loadConfig();
    this.eventbus = new EventBus(this.config.eventbus.name, this.config.eventbus.master_uri, this.config.eventbus.key);
    this.eventbus.on("socketError", (error) => {
      fatalError(error);
    });
    this.eventbus.on("rekey", (key: string) => {
      this.config.eventbus.key = key;
      this.saveConfig();
    });
  }
  loadConfig(): InstanceConfig {
    try {
      const config = JSON.parse(readFileSync(this.configpath, "utf8"));
      return config;
    } catch (error) {
      fatalError(error);
    }
  }
  saveConfig(): void {
    try {
      writeFileSync(this.configpath, JSON.stringify(this.config), "utf8");
    } catch (error) {
      fatalError(error);
    }
  }
}