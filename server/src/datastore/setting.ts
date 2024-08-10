import database from '../database';

export interface SettingDataAccess {
  getServerIcon(): Promise<Buffer | undefined>;
  getServerName(): Promise<string | undefined>;
  setServerIcon(data: Buffer): Promise<boolean>;
  setServerName(name: string): Promise<boolean>;
}

const SETTING_ICON = "SETTING_ICON";
const SETTING_NAME = "SETTING_NAME";

export class SettingDatastore implements SettingDataAccess {
  private _icon: Buffer | undefined;
  async getServerIcon(): Promise<Buffer | undefined> {
    if (this._icon) return this._icon;
    const data = await database.setting.findFirst({ where: { name: SETTING_ICON }, select: { blob: true } });
    return this._icon = data?.blob;
  }
  private _name: string | undefined;
  async getServerName(): Promise<string | undefined> {
    if (this._name) return this._name;
    const data = await database.setting.findFirst({ where: { name: SETTING_NAME }, select: { text: true } });
    return this._name = data?.text;
  }
  async setServerIcon(data: Buffer): Promise<boolean> {
    try {
      await database.setting.upsert({
        where: { name: SETTING_ICON },
        create: { name: SETTING_ICON, blob: data },
        update: { blob: data }
      });
      this._icon = data;
      return true;
    } catch {
      return false;
    }
  }
  async setServerName(name: string): Promise<boolean> {
    try {
      await database.setting.upsert({
        where: { name: SETTING_NAME },
        create: { name: SETTING_NAME, text: name },
        update: { text: name }
      });
      this._name = name;
      return true;
    } catch {
      return false;
    }
  }
}