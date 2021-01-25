import {
  writable,
  readable,
  derived
} from 'svelte/store'
import {Preferences} from './store.js'


export const User = writable()
export const IsLoggedIn = derived(User, $User => {
  return $User && $User.session_id != null
})

User.set(JSON.parse(localStorage.getItem("user")) ?? false)

User.subscribe(userData=>{
  if(userData){
    Preferences.update(p=>{
      return {
        ...p,
        region:userData.iso_3166_1,
        language:userData.iso_639_1,
        include_adult:userData.include_adult
      }
    })
  }
})
