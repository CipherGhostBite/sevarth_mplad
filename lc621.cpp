class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {

        priority_queue<int> pq;

        vector<int> word(26,0);
        for(int i=0;i<tasks.size();i++){
            word[tasks[i]-'A']++;
        }

        for(auto a:word){
            if(a>0) pq.push(a);
        }

        int count=0;
        
        while(!pq.empty()){

            int mini=min(int(pq.size()),n+1);

            vector<int>temp;
            for(int i=0;i<mini;i++){

                temp.push_back(pq.top()-1);
                pq.pop();

            }

            for(auto a:temp){
                if(a>0) pq.push(a);
            }
            count += mini;
            if (!pq.empty()) count+=(n+1-mini);
        }

        return count;
        
    }
};
