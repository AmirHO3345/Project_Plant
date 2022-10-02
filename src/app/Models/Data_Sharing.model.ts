
export class Data_SharingModel {

  static BackEnd_URL : string = "http://localhost/Articles-Management-System/public/" ;

  static ReturnPattern(Type : Pattern_Type) : string {
    switch (Type) {
      case Pattern_Type.Email :
        return "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$" ;
      case Pattern_Type.Password :
        return "^[0-9]{6}" ;
      case Pattern_Type.First_Name :
        return " " ;
      case Pattern_Type.Last_Name :
        return " " ;
    }
  }

}

export enum Process_State {
  Succeed ,
  Failed ,
  Waited ,
  UnKnown
}

export enum Pattern_Type {
  Email ,
  Password ,
  First_Name ,
  Last_Name ,
}
