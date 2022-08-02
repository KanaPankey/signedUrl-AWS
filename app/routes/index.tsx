// Import the required AWS SDK clients and commands for Node.js
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const fetch = require("node-fetch");
const https = require('https');
const fs = require('fs');
import axios from 'axios';

// TO DO:  Put credentials somewhere else *******
const AccessKeyId = 'AKIAQVS2QFFRCHLHVPR5',
      SecretKey = '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';

const creds = {
    accessKeyId: AccessKeyId,
    secretAccessKey: SecretKey
};

const s3Client = new S3Client({
    apiVersion: '2006-03-01',
    region: 'us-east-1',
    credentials: creds
});

// Set parameters
export const bucketParams = {
  Bucket: 'kana-first-bucket',
  Key: `Tester for AWS signedURL.pdf`,
};

const download = async() => {
  try {
    // Create the command
    const command = new GetObjectCommand(bucketParams);

    // Create the presigned URL
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    const response = await fetch(signedUrl);
    console.log(
      `\nResponse returned by signed URL: ${await response.text()}\n`
    );

    // download to local computer
    axios({
        url:signedUrl,
        method:'GET',
        responseType: 'blob'
    })
    .then((response) => {
       const url = window.URL
       .createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'test.pdf');
              document.body.appendChild(link);
              link.click();
    })} catch (err) {
    console.log("Error creating presigned URL", err);
    }

};


export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
        <li>
          <input type="button" value="Download" onClick={ () => download() } />
        </li>
      </ul>
    </div>
  );
}
