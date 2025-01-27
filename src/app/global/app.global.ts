import { Injectable } from '@angular/core';
@Injectable()
export class AppGlobals {
    //readonly baseAPIUrl: string = 'http://gsgassetsdev.aurionpro.com:8092/ipms/';
    //readonly baseUrl: string = 'http://kisaan.aurionpro.com/';
    // readonly baseAPIUrl: string = 'http://103.11.155.191:8091/ipms/';
    // readonly baseUrl: string = 'http://103.11.155.191:8091/upsrtc/';

    readonly baseAPIUrl: string = 'https://ipms.aurionpro.com:8096/ipms/'; // Production Deployment
    readonly baseUrl: string = 'https://ipms.aurionpro.com/';

    // readonly baseAPIUrl: string = 'https://ipmstest.aurionpro.com:8092/ipms/'; // UAT Deployment
    // readonly baseUrl: string = 'https://ipmstest.aurionpro.com/'

   // readonly baseAPIUrl: string = 'http://172.16.3.52:8092/ipms/'; // UAT Deployment
    //readonly baseUrl: string = 'http://172.16.3.52:8092/'

    // readonly baseAPIUrl: string = 'http://localhost:8095/';
    readonly pageNumer: number[] = [5, 10, 25, 50, 100];
    readonly pageSize: number = 10;
    readonly matSelectDurationTime: number = 1000;
    readonly UserRights = sessionStorage.getItem('UserRights');
    readonly baseUomList: Object[] = [

        {
            "id": 1,
            "name": "Unit"
        },
        {
            "id": 2,
            "name": "Pieces"
        },
        {
            "id": 3,
            "name": "Box"
        },
        {
            "id": 4,
            "name": "Bag"
        },
        {
            "id": 5,
            "name": "Pair"
        },
        {
            "id": 6,
            "name": "Carton"
        },
        {
            "id": 7,
            "name": "Meter"
        },
        {
            "id": 8,
            "name": "KM"
        },
        {
            "id": 9,
            "name": "Sq KM"
        },
        {
            "id": 10,
            "name": "Nos"
        },
        {
            "id": 11,
            "name": "KG"
        },
        {
            "id": 12,
            "name": "Set"
        },
        {
            "id": 13,
            "name": "Years"
        },
        {
            "id": 14,
            "name": "Person"
        },
        {
            "id": 15,
            "name": "Months"
        },
        {
            "id": 16,
            "name": "Man-Days"
        },
        {
            "id": 17,
            "name": "Dozen"
        }
    ];

    readonly assetStatusList: Object[] = [

        {
            "id": 1,
            "name": "UNDER REPAIR"
        },
        {
            "id": 2,
            "name": "READY FOR USE"
        },
        {
            "id": 3,
            "name": "DEFECTIVE"
        },
        {
            "id": 4,
            "name": "SCRAPPED"
        },
        {
            "id": 5,
            "name": "RESERVED/SPARED"
        },
        {
            "id": 6,
            "name": "OK"
        },
        {
            "id": 7,
            "name": "DAMAGED"
        },
        {
            "id": 8,
            "name": "STOLEN"
        },
        {
            "id": 9,
            "name": "REPLACED"
        }

    ];
    readonly completionStatus: Object[] = [{ "id": "101", "name": "OPEN" }, { "id": "102", "name": "CLOSE" },
    { "id": "103", "name": "ONHOLD" }, { "id": "104", "name": "DEFERRED" }];


    thirdPartyCredentials: Object[] = [

        {
            "userid": "jitendra.dubey@aurionpro.com",
            "password": "959444170"

        }

    ]

    readonly poRcWorkflow: string = "PO_BY_RC_APPROVAL";
}