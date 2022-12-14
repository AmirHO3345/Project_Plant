import {Data_SharingModel} from "./Data_Sharing.model";

export class PersonModel {

  private readonly Person_ID : number ;

  private readonly Token_ID : string ;

  private readonly Person_Type : Person ;

  private First_Name : string ;

  private Last_Name : string ;

  private Image_Path : {
    Path : string ,
    IsDefault : boolean
  } ;

  private Email : string ;

  private Phone : string | null ;

  constructor(id : number , token : string , f_name : string , l_name : string , image :string
              , type : Person , email : string , phone : string | null) {
    this.Person_ID = id ;
    this.Token_ID = token ;
    this.Person_Type = type ;
    this.First_Name = f_name ;
    this.Last_Name = l_name ;
    this.Image_Path = {
      Path : image ,
      IsDefault : (image == Data_SharingModel.PathPhotoDefault)
    }
    this.Email = email ;
    this.Phone = phone
  }

  public GetToken() : string {
    return `Bearer ${this.Token_ID}` ;
  }

  public GetClearToken() : string {
    return `${this.Token_ID}` ;
  }

  public GetType() : Person {
    return this.Person_Type ;
  }

  public Clone() : PersonModel {
    let id = this.Person_ID ;
    let token = this.Token_ID ;
    let type = this.Person_Type ;
    let f_name = this.First_Name ;
    let l_name  = this.Last_Name ;
    let image = this.Image_Path.Path ;
    let email = this.Email ;
    let phone = this.Phone ;
    return new PersonModel(id , token , f_name , l_name , image , type , email , phone) ;
  }

  public Get_Information() {
    return {
      First_Name : this.First_Name ,
      Last_Name : this.Last_Name ,
      Full_Name : this.First_Name.concat(' ' , this.Last_Name) ,
      Image : {
        Path : Data_SharingModel.BackEnd_URL.concat(this.Image_Path.Path) ,
        IsDefault : this.Image_Path.IsDefault
      } ,
      email : this.Email ,
      phone : this.Phone
    } ;
  }

  public Update_Information( InfoUpdate : {
    f_name ?: string ,
    l_name ?: string ,
    image ?: string ,
    email ?: string ,
    phone ?: string | null
  }) {
    if(InfoUpdate.f_name != undefined)
      this.First_Name = InfoUpdate.f_name ;
    if(InfoUpdate.l_name != undefined)
      this.Last_Name = InfoUpdate.l_name ;
    if(InfoUpdate.image != undefined)
      this.Image_Path = {
        Path : InfoUpdate.image ,
        IsDefault : (InfoUpdate.image == Data_SharingModel.PathPhotoDefault)
      } ;
    if(InfoUpdate.email != undefined)
      this.Email = InfoUpdate.email ;
    if(InfoUpdate.phone !== undefined) {
      this.Phone = InfoUpdate.phone ;
    }
  }

  public static Convert2Person(Type : string) : Person {
    switch (Type) {
      case 'admin' :
        return Person.Admin ;
      case 'writer' :
        return Person.Writer ;
      case 'user' :
        return Person.User ;
      default :
        return Person.UnKnown
    }
  }

  public static Convert2BackEnd(Type : Person) : string {
    switch (Type) {
      case Person.Admin :
        return 'admin';
      case Person.Writer :
        return 'writer';
      case Person.User :
        return 'user' ;
      case Person.UnKnown:
        return '' ;
    }
  }

}

export enum Person {
  User,
  Writer ,
  Admin ,
  UnKnown
}
