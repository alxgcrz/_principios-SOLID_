/*
 * ************************************************************************
 *  Copyright (c) 2018 @alxgcrz <alxgcrz@outlook.com>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 * ***********************************************************************
 */

package solid.lsp.violation;

import java.util.ArrayList;
import java.util.List;

class Bird {

    void fly() {}

    void eat() {}

    public static void main(String[] args) {
        List<Bird> birdList = new ArrayList<Bird>();
        birdList.add(new Bird());
        birdList.add(new Crow());
        birdList.add(new Ostrich());
        letTheBirdsFly(birdList);
    }

    static void letTheBirdsFly(List<Bird> birdList) {
        for (Bird b : birdList) {
            b.fly();
        }
    }
}
