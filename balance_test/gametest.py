from numpy import random

map_x_size = 10
map_list = [0 for i in range(map_x_size)]

class Character:
    def __init__(self,level, HP, atk, speed, attack_speed, critical_hit_rate, evasion_rate, exp):
        print("Character Production")
        self.result = 0
        self.level = level
        self.HP = HP
        self.atk = atk
        self.speed = speed
        self.attack_speed = attack_speed
        self.critical_hit_rate = critical_hit_rate
        self.evasion_rate = evasion_rate
        self.exp = exp
    

    def print_info(self):
        print("--------------------")
        print("level: ",self.level)
        print("HP: ",self.HP)
        print("ATK: ",self.atk)
        print("Speed: ",self.speed)
        print("Attak_Speed: ",self.attack_speed)
        print("Critical_hit_rate: ",self.critical_hit_rate)
        print("Evasion_rate: ",self.evasion_rate)
        print("EXP: ",self.exp)
        print("--------------------")
    
    #캐릭터 레벨업 시 스펙업
    def level_up(self):
        print("level up!!")
        self.level += 1
        self.HP += 10
        self.atk += 1
        if self.level%10 == 0:
            self.speed += 1
            self.attack_speed += 1
            self.evasion_rate += 1

    def charactor_dps(self):
        dps = self.atk * self.attack_speed
        return dps

    def charactor_exp(self):
        return self.exp

    def exp_up(self):
        self.exp += 10


class Monster:
    def __init__(self, HP, atk, attack_speed, evasion_rate, exp):
        self.result = 0
        self.HP = HP
        self.atk = atk
        self.attack_speed = attack_speed
        self.evasion_rate = evasion_rate
        self.exp = exp


    def print_info(self):
        print("\n--------------------\nMonster apperance!!")
        print("--------------------")
        print("Monster")
        print("HP: ",self.HP)
        print("ATK: ",self.atk)
        print("Attak_Speed: ",self.attack_speed)
        print("Evasion_rate: ",self.evasion_rate)
        print("EXP: ",self.exp)
        print("--------------------")

    def monster_exp(self):
        return self.exp

    def monster_dps(self):
        dps = self.atk * self.attack_speed
        return dps

#레벨 당 exp총량
def level_per_exp():
    edic={1:10,2:10}
    for i in range(3, 100):
        if i % 10 == 0:
            edic[i] = edic.get(i-1)*2
        else:
            edic[i] = edic.get(i-1)+edic.get(i-2)
    
    return edic

#몬스터 처치 옵션
def Monster_dead(hero, monster_exp):
    print("Kill the monster!!")
    hero.exp += monster_exp
    hero.print_info()


#캐릭터 맵 움직이는 거 도식화, monster_fiting과 연결
def map_schematic():
    map_list[-2] = 'M'
    for i in range(map_x_size):
        if map_list[i] == 'M':
            monster.print_info()
            monster_fiting()
        map_list[i] = "C"
        map_list[i-1] = 0
        print(map_list)
    
    if map_list[-1] == "C":
        print("--------------------\nGame Over\n--------------------")

#확률 옵션
def percentage_condition(percent):
    true_condition = random.binomial(n=1, p= percent/100, size=1)
    if true_condition[0] == 1:
        return True

#회피 옵션
def evasion_condition(evasion_rate):
    if percentage_condition(evasion_rate):
        print("--------------------\nMiss!\n--------------------")


#공격시 옵션(치명타, 회피)
def attak_condition():
    if percentage_condition(monster.evasion_rate):
        print("--------------------\nMiss!\n--------------------")
    else:
        if percentage_condition(hero.critical_hit_rate):
            print("--------------------\nCritical Hitting!\n--------------------")
            monster.HP -= hero.charactor_dps()*2
            print("Monster HP: ", monster.HP)
        else:
            print("--------------------\nHitting!\n--------------------")
            monster.HP -= hero.charactor_dps()
            print("Monster HP: ", monster.HP)


#몬스터 만날시 싸움 옵션, Monster_dead 연결
def monster_fiting():
    while True:
        attak_condition()
        if monster.HP <= 0:
            Monster_dead(hero, monster.exp)
            if hero.exp >= level_exp[hero.level]:
                hero.level_up()
                hero.print_info()
            break


def time_calculator():
    time = map_x_size/hero.speed + monster.HP/hero.charactor_dps()
    print("Total Time: ",time)




if __name__ =="__main__":
    print("--------------------\nGame Start\n--------------------")
    level_exp = level_per_exp()
    #level, hp, atk, speed, attack_speed, criticl_hit_rate, evasion_rate, exp
    hero = Character(1,100,10,1,1,50,1,0)
    hero.print_info()
    #hp, atk, attack_speed, evasion_rate, exp
    monster = Monster(300, 1, 1, 1, 10)

    map_schematic()
    time_calculator()