import { Injectable, inject } from '@angular/core';
import * as RNBO from '@rnbo/js';
import { RnboLoaderService } from './rnbo-loader.service';

// async types -  setBuffer, setPreset,

enum ListenableEventSubscribers {
  message = 'messageEvent',
  midi = 'midiEvent',
  preset = 'presetTouchedEvent',
  parameter = 'parameterChangeEvent',
}

type ListenableEventTypes = {
  message: RNBO.MessageEvent;
  midi: RNBO.MIDIEvent;
  preset: RNBO.PresetEvent;
  parameter: RNBO.Parameter;
};
type evtHandler = RNBO.IEventListener<RNBO.MessageEvent> & RNBO.IEventListener<RNBO.MIDIEvent> & RNBO.IEventListener<void> & RNBO.IEventListener<RNBO.Parameter>;
enum SchedulableEvents {
  transport,
  beattime,
  tempo,
  timesignature,
  message,
  midi,
  parameter,
}
interface SchedulableEventTypes {
  transport: boolean;
  beattime: number;
  tempo: number;
  timesignature: [number, number];
  message: [string, ...number[]];
  midi: [number, number, number, number?];
  parameter: [string, number | string, boolean?];
}

type SubscriptionTracker = {
  [Prop in keyof ListenableEventTypes]: RNBO.IEventSubscription[];
};
@Injectable({
  providedIn: 'root',
})
export class RnboEventHubService {
  public readonly rnboLoader: RnboLoaderService = inject(RnboLoaderService);
  subscriptions: Map<string, SubscriptionTracker> = new Map(); // device ID, activeSubscriptions.

  constructor() {}
  addEventHandler<Evt extends keyof typeof ListenableEventSubscribers>(
    device_id: string,
    device: RNBO.BaseDevice,
    eventType: Evt,
    handler: (e: ListenableEventTypes[Evt]) => void
  ) {
      let activeSubscriptions = this.subscriptions.get(device_id) ?? {
        message: [],
        midi: [],
        preset: [],
        parameter: [],
      };
      let subscriber = ListenableEventSubscribers[eventType];
      activeSubscriptions[eventType].push(
        device[subscriber].subscribe(handler as evtHandler) as RNBO.IEventSubscription
      );
      this.subscriptions.set(device_id, activeSubscriptions);
  }
  // eventValue: boolean|number|[number]|[number, number]|[number,number,number,number]|[string, number],

  // timeMode (in vs. at timing) could be extended significantly, e.g. 'every', 'every-until',

  // for now, less than 0 is 'in', greater than 0 is at, and 0 is now
  // eventData: SchedulableEventTypes[T] <- didn;t seemed to work
  scheduleEvent<T extends keyof typeof SchedulableEvents>(
    device_name: string,
    eventType: T,
    time: number,
    eventData: any[] | any
  ) {
    let eventTime =
      time > 0
        ? Math.max(time, RNBO.TimeNow)
        : time === 0
        ? RNBO.TimeNow
        : RNBO.TimeNow + time * -1;
    const device = this.rnboLoader.devices.get(device_name);
    if (!device) {
      throw new Error(`device with id ${device_name} does not exist`);
    } else {
      switch (eventType) {
        case 'parameter':
          /// ??? shouldn;t have to do this
          setTimeout(
            () =>
              this.setParameter(
                device_name,
                ...(eventData as SchedulableEventTypes['parameter'])
              ),
            RNBO.TimeNow - eventTime
          );
          break;
        case 'message':
          let tag = (
            eventData as SchedulableEventTypes['message']
          ).shift() as string;
          device.scheduleEvent(
            new RNBO.MessageEvent(eventTime, tag, eventData as number[])
          );
          break;
        case 'beattime':
          device.scheduleEvent(
            new RNBO.BeatTimeEvent(eventTime, eventData as number)
          );
          break;
        case 'midi':
          let port = eventData.length === 4 ? eventData.pop() : 0;
          device.scheduleEvent(
            new RNBO.MIDIEvent(eventTime, port, eventData as RNBO.MIDIData)
          );
          break;
        case 'tempo':
          device.scheduleEvent(
            new RNBO.TempoEvent(eventTime, eventData as number)
          );
          break;
        case 'timesignature':
          device.scheduleEvent(
            new RNBO.TimeSignatureEvent(
              eventTime,
              ...(eventData as [number, number])
            )
          );
          break;
        case 'transport':
          device.scheduleEvent(
            new RNBO.TransportEvent(eventTime, eventData as 0 | 1)
          );
          break;
        default:
          throw new Error(
            `unknown event type: ${eventType} with event ${event}`
          );
      }
    }
  }
  setParameter(
    device_name: string,
    parameter_id: string,
    value: number | string,
    isNormalized?: boolean
  ) {
    const device = this.rnboLoader.devices.get(device_name);
    if (!device) {
      throw new Error(`device with id ${device_name} does not exist`);
    } else {
      let param = device.parametersById.get(parameter_id);
      if (!param) {
        throw new Error(`param with id ${parameter_id} does not exist`);
      } else {
        if (typeof value === 'string') {
          if (param instanceof RNBO.EnumParameter) {
            param.enumValue = value;
          } else {
            throw new Error(
              `param with id ${parameter_id} cannot be set to string value ${value}, as it is not an EnumParameter type `
            );
          }
        } else {
          if (param instanceof RNBO.NumberParameter) {
            if (isNormalized) {
              param.normalizedValue = value;
            } else {
              param.value = value;
            }
          }
        }
      }
    }
  }
}
