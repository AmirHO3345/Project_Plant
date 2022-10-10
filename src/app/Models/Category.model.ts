import {Data_SharingModel} from "./Data_Sharing.model";

export class CategoryModel {

  private readonly ID : number ;

  private readonly Parent_ID : number | null ;

  private readonly Name : string ;

  private readonly Description : string ;

  private readonly Path_Photo : string ;

  private readonly MoreInfo : {
    ArticlesCount : number ,
    ChildrenCount ?: number
  }

  constructor(id : number , parent : number | null , name : string , description : string ,
              photo : string , countArticle : number , countChild ?: number) {
    this.ID = id ;
    this.Parent_ID = parent ;
    this.Name = name ;
    this.Description = description ;
    this.Path_Photo = photo ;
    this.MoreInfo = {
      ArticlesCount : countArticle ,
      ChildrenCount : countChild
    }
  }

  public Get_Information() {
    return {
      Category_ID : this.ID ,
      Category_Name : this.Name ,
      Category_Description : this.Description ,
      Photo : Data_SharingModel.BackEnd_URL.concat(this.Path_Photo) ,
      Articles : this.MoreInfo.ArticlesCount ,
      CategoryChildren : this.MoreInfo.ChildrenCount || null
    } ;
  }

  public Clone() : CategoryModel {
    let id = this.ID ;
    let id_parent = this.Parent_ID ;
    let name = this.Name ;
    let description = this.Description ;
    let image = this.Path_Photo ;
    let articles = this.MoreInfo.ArticlesCount ;
    let children = this.MoreInfo.ChildrenCount ;
    return new CategoryModel(id , id_parent , name , description
      , image , articles , children) ;
  }

  public IsParent() {
    return (this.MoreInfo.ChildrenCount!=undefined) ;
  }
}
