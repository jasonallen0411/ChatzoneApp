import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class GetTodosServiceService {
  todoItems:Observable<any[]>;
  user:any;
  userName;
  db;

  removeTodo(k){
    this.db.list('/todos').remove(k);
  }

  updateTodo(k,v){
    this.db.list('/todos').update(k, { task: v });
  }

  todoCompleted(k,c){
    this.db.list('/todos').update(k, { completed: c });
  }

  addTodo(taskInput){
    console.log('The user is:' + this.userName);
    this.db.list('/chatusers').push({text: taskInput, userid: this.user.uid, useremail: this.user.email, username: this.userName});
    
    //this.db.list('/todos').push({"completed":false, "task":taskInput});
    // let td = this.db.object('/todos/').set({user: this.user.uid});
    // td.push({"completed":false, "task":taskInput});
    // console.log(td);
    
    //({"completed":false, "task":taskInput});
  }

  constructor(db: AngularFireDatabase, private firebaseAuth: AngularFireAuth) {
    this.firebaseAuth.auth.onAuthStateChanged(user => {
      if( user ){
        this.user = user;
        this.userName= user.displayName;
        console.log(this.user);
      } else {
        
      }
    }); 
    this.db = db
    this.todoItems = db.list('/chatusers').snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val(), updateText:""}))
      )
    );
  }
}
