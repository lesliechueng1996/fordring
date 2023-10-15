import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';

@Injectable()
export class QiniuService {
  bucket: string;
  accessKey: string;
  secretKey: string;
  mac: qiniu.auth.digest.Mac;

  constructor(private readonly configService: ConfigService) {
    this.bucket = configService.get('QINIU_BUCKET');
    this.accessKey = configService.get('QINIU_ACCESS_KEY');
    this.secretKey = configService.get('QINIU_SECRET_KEY');
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
  }

  simpleUploadToken(expireSeconds: number = 7200) {
    const options = {
      scope: this.bucket,
      expires: expireSeconds,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(this.mac);
    return uploadToken;
  }
}
