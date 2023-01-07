import http from '@utils/request';

const device_id = 'vdevo167168920239060';

/**
 * @language en-US
 * @description Get product configuration information.
 */
/**
 * @language zh-CN
 * @description 获取接口token
 */

export const getToken = (params: any) => http.get('/v1.0/token', { params });

/**
 * @language en-US
 * @description Get product configuration information.
 */
/**
 * @language zh-CN
 * @description 设备下方指令
 */

export const handleCommands = (data: any) =>
  http.post(
    `/v1.0/devices/${device_id}/commands`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
