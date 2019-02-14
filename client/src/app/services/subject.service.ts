import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SubjectService {
  private deleteMsg = new BehaviorSubject(null);
  currentDeletePetitioner = this.deleteMsg.asObservable();

  constructor() {}

  changeDeletePetitioner(petitioner: string) {
    this.deleteMsg.next(petitioner);
  }
}
