export class AssetFilterSession {
    assetname: string;
    category: string;
    projectid: string;
    state:string;
    district:string;
    city:string;
    location:string;
}

export class AssetMisFilterSession {
    category: string;
    subcategory: string;
    projectid: string;
    state:string;
    district:string;
    assetstatus:string;
}

export class ConstantFilterSession {
    constantname: string;
}
export class DCFilterSession {
    dcno: string;
    projectname: string;
}
export class CategoryFilterSession {
    categoryname: string;
}
export class ProductMasterMisFilterSession {
    productname: string;
    serialno: string;
    producttype: string;
    category:string;
    subcategory:string;
}
export class ModelMasterFilterSession {
    modelname:string;
}
export class ManufacturerFilterSession {
    manufacturername:string;
}
