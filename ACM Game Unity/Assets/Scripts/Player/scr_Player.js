﻿#pragma strict

var health : int = 100;
var bullet_pref : Transform; // prefab used for bullets
var fireRate : float = .5;
var nextShot : float = 0.0;
var range : int;
var attack : int;
var attackSpeed : int;
var damage : int; // the ammount of damage done by this actor
var armor : int; // resistance to damage
var vision : int; // how far this actor can see
var ammo : int; // ammo

var countText : GUIText;
var gui_Health : GUIText;
var gui_Ammo : GUIText;

enum Targeting { Keyboard, Point, RTS } // targeting types
internal var killCount : int; // temporary counter to add some fluff to the UI
internal var targetType : Targeting; // the current targeting type being used
internal var targetPosition : Vector2; // the position of the player's target or cursor

// skill counters
internal var fireAoeMax : int; // time in between AOE skills
internal var fireAoeCounter: int; // countdown to recharge skill

// lists
var enemyList : GameObject[];

function Start () {
	// default target type
	targetType = Targeting.Point;
	
	// initilize lists
	enemyList = GameObject.FindGameObjectsWithTag('Enemy') as GameObject[];
	
	// skill counters
	fireAoeCounter = fireAoeMax;
	
	// kill count
	killCount = 0;
	
	// set up GUI
	updateGUI();

}

function Update () {
	// run clock
	Clock();
	
	// shoot
	if (Input.GetButton("FireBullet")){
		Fire();
	}
	
	// use skills
	if (Input.GetButtonDown("Skill1")) {
		FireAreaDamage();
	}
	
	// change targeting type
	if (Input.GetButtonDown("Fire2")) {
		if (targetType == Targeting.Keyboard) {
			targetType = Targeting.Point;
		} else if (targetType == Targeting.Point) {
			targetType = Targeting.RTS;
		} else if (targetType == Targeting.RTS) {
			targetType = Targeting.Keyboard;
		}
		
		Debug.Log(targetType);
		//Debug.Log("One Press!");
	}
	
	// mouse click to fire
	if (Input.GetButtonDown("Fire3")){
			targetPosition = Vector2(Input.mousePosition.x,Input.mousePosition.y);
			targetPosition = Camera.main.ScreenToWorldPoint(targetPosition);
			Fire();

	}
}

function FireAreaDamage(){
		if (fireAoeCounter <= 0) {
		// increase counter to max
		fireAoeCounter = fireAoeMax;
		
		Debug.Log("AOE Attack");
		
		// do AOE damage
		enemyList = GameObject.FindGameObjectsWithTag('Enemy') as GameObject[];
		
		// run through enemy array
		for(var i : int = 0; i < enemyList.length; i++){
			//Debug.Log("Enemy " + i);
			if (Vector2.Distance(transform.position, enemyList[i].transform.position) < range) {
				//Debug.Log("I am here!");
				// do damage to enemy
				if (attack + Random.Range(0,4) > enemyList[i].GetComponent(scr_Enemy).armor){
					// decrease health
					enemyList[i].GetComponent(scr_Enemy).currentHealth -= damage + Random.Range(0,2);
				}
			}
		}
	}
}


function Clock(){
	// fire AOE
	if (fireAoeCounter > 0) {
		fireAoeCounter--;
	}
}

function Fire(){
 	if (Time.time >= nextShot && ammo > 0){
 	
 		// create an instance of the bullet
 		if (targetType == Targeting.Keyboard) {
 			Instantiate(bullet_pref,Vector2(transform.position.x,transform.position.y),Quaternion.identity);
 		} else if (targetType == Targeting.Point) {
 			Instantiate(bullet_pref,Vector2(transform.position.x,transform.position.y),Quaternion.identity);
 		} else if (targetType == Targeting.RTS) {
 			Instantiate(bullet_pref,Vector2(transform.position.x,transform.position.y),Quaternion.identity);
 		}
 		// prevent the player from firing again immediately
 		nextShot = Time.time + fireRate;
 		
 		ammo--; // subtract ammo
 		updateGUI();
	}
}

function updateGUI(){
	countText.text = "Kills: " + killCount.ToString();
	gui_Ammo.text = "Ammo: " + ammo.ToString();
	gui_Health.text = "Health: " + health.ToString();
}